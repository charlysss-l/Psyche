"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authPsychSchema_1 = __importDefault(require("../authModels/authPsychSchema")); // Ensure the path is correct
// Controller function for login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await authPsychSchema_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        // Compare the provided password with the stored hash
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // Return the token
        return res.json({ token });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.login = login;
