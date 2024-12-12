"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authPsychController_1 = require("../authControllers/authPsychController");
const router = (0, express_1.Router)();
// POST route for login
router.post('/', async (req, res) => {
    try {
        await (0, authPsychController_1.login)(req, res); // Call the login controller function
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
// PUT route for updating username and password
router.put('/update', async (req, res) => {
    try {
        await (0, authPsychController_1.updateUser)(req, res); // Call the update controller function
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.post('/forgot-password', async (req, res) => {
    try {
        await (0, authPsychController_1.forgotPassword)(req, res); // Call the login controller function
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.default = router;
