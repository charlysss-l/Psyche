"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../authControllers/userController");
const router = (0, express_1.Router)();
// GET route to fetch all users
router.get('/users', async (req, res) => {
    try {
        await (0, userController_1.getAllUsers)(req, res); // Call the getAllUsers controller function
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
// PUT route to edit a user
router.put('/users/:userId', async (req, res) => {
    try {
        await (0, userController_1.editUser)(req, res); // Call the editUser controller function
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating user' });
    }
});
// DELETE route to delete a user
router.delete('/users/:userId', async (req, res) => {
    try {
        await (0, userController_1.deleteUser)(req, res); // Call the deleteUser controller function
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
});
exports.default = router;
