"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentByUserId = exports.getAllStudents = exports.getStudentProfile = exports.updateStudentProfile = exports.loginStudent = exports.signupStudent = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authStudentsSchema_1 = __importDefault(require("../authModels/authStudentsSchema"));
// Sign Up Student
const signupStudent = async (req, res) => {
    const { email, password, studentNumber, userId } = req.body;
    try {
        // Check if email or userId already exists
        const existingStudent = await authStudentsSchema_1.default.findOne({ $or: [{ email }, { studentNumber }, { userId }] });
        if (existingStudent) {
            // Send specific errors if email or userId exists
            if (existingStudent.email === email) {
                return res.status(400).json({ error: 'email_exists' }); // Correct error handling for email
            }
            if (existingStudent.userId === userId) {
                return res.status(400).json({ error: 'userId_exists' }); // Correct error handling for userId
            }
        }
        // Hash the password and save the new student
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const newStudent = new authStudentsSchema_1.default({
            email,
            password: hashedPassword,
            studentNumber,
            userId,
        });
        await newStudent.save();
        return res.status(201).json({ message: 'Student created successfully' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.signupStudent = signupStudent;
// Login Student
const loginStudent = async (req, res) => {
    const { email, password } = req.body;
    try {
        const student = await authStudentsSchema_1.default.findOne({ email });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, student.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({ message: 'JWT secret is missing' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: student._id }, jwtSecret, { expiresIn: '1h' });
        return res.status(200).json({ message: 'Login successful', token, studentId: student._id && student.userId, userId: student.userId });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.loginStudent = loginStudent;
// Update Student Profile
const updateStudentProfile = async (req, res) => {
    const { username, studentNumber, password } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }
    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({ message: 'JWT secret is missing' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        const studentId = decoded.userId;
        const student = await authStudentsSchema_1.default.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        // Check if the provided email or password is the same as the current ones
        const updates = {};
        if (username && username !== student.email)
            updates.email = username;
        if (studentNumber && studentNumber !== student.studentNumber)
            updates.studentNumber = studentNumber;
        if (password && password !== student.password)
            updates.password = await bcryptjs_1.default.hash(password, 12);
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No changes detected. Profile update failed.' });
        }
        const updatedStudent = await authStudentsSchema_1.default.findByIdAndUpdate(studentId, updates, { new: true });
        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({ message: 'Profile updated successfully' });
    }
    catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error while updating profile' });
    }
};
exports.updateStudentProfile = updateStudentProfile;
// Get Student Profile
// Get Student Profile
const getStudentProfile = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }
    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({ message: 'JWT secret is missing' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        const student = await authStudentsSchema_1.default.findById(decoded.userId, 'email userId studentNumber');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({ email: student.email, studentNumber: student.studentNumber, userId: student.userId });
    }
    catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error while fetching profile' });
    }
};
exports.getStudentProfile = getStudentProfile;
// Get All Students
const getAllStudents = async (req, res) => {
    try {
        const students = await authStudentsSchema_1.default.find({}, 'email userId'); // Fetch only email and userId fields
        return res.status(200).json(students);
    }
    catch (error) {
        console.error('Error fetching students:', error);
        return res.status(500).json({ message: 'Server error while fetching students' });
    }
};
exports.getAllStudents = getAllStudents;
// Get Student by userId
const getStudentByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const student = await authStudentsSchema_1.default.findOne({ userId }, 'email userId'); // Fetch only email and userId fields
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        return res.status(200).json(student);
    }
    catch (error) {
        console.error('Error fetching student:', error);
        return res.status(500).json({ message: 'Server error while fetching student' });
    }
};
exports.getStudentByUserId = getStudentByUserId;
