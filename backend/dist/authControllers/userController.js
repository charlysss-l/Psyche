"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.editUser = exports.getAllUsers = void 0;
const authGuidanceSchema_1 = __importDefault(require("../authModels/authGuidanceSchema")); // Guidance model
const authStudentsSchema_1 = __importDefault(require("../authModels/authStudentsSchema")); // Student model
const authPsychSchema_1 = __importDefault(require("../authModels/authPsychSchema")); // Psychology model (fix the name of the model file)
// Fetch all users
const getAllUsers = async (req, res) => {
    try {
        // Fetch all guidance users
        const guidanceUsers = await authGuidanceSchema_1.default.find().select('email'); // Select only email
        // Fetch all psychology users
        const psychUsers = await authPsychSchema_1.default.find().select('email'); // Select only email
        // Fetch all students
        const studentUsers = await authStudentsSchema_1.default.find().select('userId email studentNumber'); // Select only email
        // Combine the data into one array
        const allUsers = [
            ...guidanceUsers.map(user => ({ userId: user._id, email: user.email, role: 'Guidance' })),
            ...psychUsers.map(user => ({ userId: user._id, email: user.email, role: 'Psychology' })),
            ...studentUsers.map(user => ({ userId: user.userId, studentNumber: user.studentNumber, email: user.email, role: 'Student' }))
        ];
        // Return the combined user list as JSON
        res.status(200).json(allUsers);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error while fetching users' });
    }
};
exports.getAllUsers = getAllUsers;
// Edit a user (Update their email or role)
const editUser = async (req, res) => {
    const { userId } = req.params;
    const { email, role } = req.body;
    try {
        let user;
        if (role === 'Guidance') {
            user = await authGuidanceSchema_1.default.findByIdAndUpdate(userId, { email }, { new: true });
        }
        else if (role === 'Psychology') {
            user = await authPsychSchema_1.default.findByIdAndUpdate(userId, { email }, { new: true });
        }
        else if (role === 'Student') {
            user = await authStudentsSchema_1.default.findOneAndUpdate({ userId }, { email }, { new: true });
        }
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'User updated successfully', user });
    }
    catch (error) {
        console.error('Error editing user:', error);
        res.status(500).json({ message: 'Server error while editing user' });
    }
};
exports.editUser = editUser;
// Delete a user
const deleteUser = async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;
    try {
        let user;
        if (role === 'Guidance') {
            user = await authGuidanceSchema_1.default.findByIdAndDelete(userId);
        }
        else if (role === 'Psychology') {
            user = await authPsychSchema_1.default.findByIdAndDelete(userId);
        }
        else if (role === 'Student') {
            user = await authStudentsSchema_1.default.findOneAndDelete({ userId });
        }
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error while deleting user' });
    }
};
exports.deleteUser = deleteUser;
