"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = exports.updateGuidanceUser = exports.loginGuidance = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authGuidanceSchema_1 = __importDefault(require("../authModels/authGuidanceSchema"));
const loginGuidance = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await authGuidanceSchema_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({ message: 'JWT secret is missing' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });
        return res.status(200).json({ message: 'Login successful', token });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.loginGuidance = loginGuidance;
// New function to handle user update without requiring userId in the request body
const updateGuidanceUser = async (req, res) => {
    const { username, password } = req.body;
    // Extract userId from JWT token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }
    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({ message: 'JWT secret is missing' });
        }
        // Verify the token and extract userId
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        const userId = decoded.userId;
        // Hash the new password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Update username and password
        const updatedUser = await authGuidanceSchema_1.default.findByIdAndUpdate(userId, { username, password: hashedPassword }, { new: true } // Return the updated document
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User updated successfully', user: updatedUser });
    }
    catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error while updating user' });
    }
};
exports.updateGuidanceUser = updateGuidanceUser;
// Forgot Password
const forgotPassword = async (req, res) => {
    const { username, newPassword } = req.body;
    if (username !== "cvsu.guidance@gmail.com") {
        return res.status(400).json({ message: "Invalid username." });
    }
    try {
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        const user = await authGuidanceSchema_1.default.findOneAndUpdate({ email: username }, { password: hashedPassword }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json({ message: "Password reset successful." });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while resetting password." });
    }
};
exports.forgotPassword = forgotPassword;
