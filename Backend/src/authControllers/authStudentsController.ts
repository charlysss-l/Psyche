import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Student from '../authModels/authStudentsSchema';


// Sign Up Student
export const signupStudent = async (req: Request, res: Response): Promise<Response> => {
    const { email, password, studentNumber, userId } = req.body;

    try {
        // Check if email or userId already exists
        const existingStudent = await Student.findOne({ $or: [{ email }, {studentNumber}, { userId }] });

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
        const hashedPassword = await bcrypt.hash(password, 12);
        const newStudent = new Student({
            email,
            password: hashedPassword,
            studentNumber,
            userId,
        });

        await newStudent.save();
        return res.status(201).json({ message: 'Student created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};



// Login Student
export const loginStudent = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    try {
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({ message: 'JWT secret is missing' });
        }

        const token = jwt.sign({ userId: student._id }, jwtSecret, { expiresIn: '1h' });
        return res.status(200).json({ message: 'Login successful', token, studentId: student._id && student.userId , userId: student.userId  });
        

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Update Student Profile
export const updateStudentProfile = async (req: Request, res: Response) => {
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

        const decoded = jwt.verify(token, jwtSecret) as { userId: string };
        const studentId = decoded.userId;

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check if the provided email or password is the same as the current ones
        const updates: { email?: string; studentNumber?: string; password?: string } = {};
        if (username && username !== student.email) updates.email = username;
        if (studentNumber && studentNumber !== student.studentNumber) updates.studentNumber = studentNumber;
        if (password && password !== student.password) updates.password = await bcrypt.hash(password, 12);

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No changes detected. Profile update failed.' });
        }

        const updatedStudent = await Student.findByIdAndUpdate(
            studentId,
            updates,
            { new: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error while updating profile' });
    }
};

// Get Student Profile
// Get Student Profile
export const getStudentProfile = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }
  
    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({ message: 'JWT secret is missing' });
        }
  
        const decoded = jwt.verify(token, jwtSecret) as { userId: string };
        const student = await Student.findById(decoded.userId, 'email userId studentNumber');
  
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
  
        res.json({ email: student.email, studentNumber: student.studentNumber, userId: student.userId });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error while fetching profile' });
    }
  };
  
// Get All Students
export const getAllStudents = async (req: Request, res: Response): Promise<Response> => {
    try {
        const students = await Student.find({}, 'email userId'); // Fetch only email and userId fields
        return res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        return res.status(500).json({ message: 'Server error while fetching students' });
    }
};

// Get Student by userId
export const getStudentByUserId = async (req: Request, res: Response): Promise<Response> => {
    const { userId } = req.params;

    try {
        const student = await Student.findOne({ userId }, 'email userId'); // Fetch only email and userId fields
        
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        return res.status(200).json(student);
    } catch (error) {
        console.error('Error fetching student:', error);
        return res.status(500).json({ message: 'Server error while fetching student' });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    const { email, newPassword } = req.body;  // Accept newPassword from frontend

    try {
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        student.password = hashedPassword;
        await student.save();

        return res.status(200).json({ message: "Password reset successfully." });
    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({ message: "Server error while resetting password" });
    }
};