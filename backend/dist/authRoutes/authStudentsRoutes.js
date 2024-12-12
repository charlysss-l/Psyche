"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authStudentsController_1 = require("../authControllers/authStudentsController");
const router = (0, express_1.Router)();
// Student Signup Route
router.post('/signup', async (req, res) => {
    try {
        await (0, authStudentsController_1.signupStudent)(req, res);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Student Login Route
router.post('/login', async (req, res) => {
    try {
        await (0, authStudentsController_1.loginStudent)(req, res);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Update Student Profile
router.put('/update', async (req, res) => {
    try {
        await (0, authStudentsController_1.updateStudentProfile)(req, res);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Get Student Profile
router.get('/profile', async (req, res) => {
    try {
        await (0, authStudentsController_1.getStudentProfile)(req, res);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Get Student Profile
router.get('/students', async (req, res) => {
    try {
        await (0, authStudentsController_1.getAllStudents)(req, res);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Get Student Profile by user ID
router.get('/students/:userId', async (req, res) => {
    try {
        await (0, authStudentsController_1.getStudentByUserId)(req, res);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.default = router;
