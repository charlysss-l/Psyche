"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express"); // Make sure to import Request and Response
const UserIQTestController_1 = require("../controllers/UserIQTestController"); // Ensure this path is correct
const router = (0, express_1.Router)();
// Route to create a new IQ test result
router.post('/', async (req, res) => {
    try {
        await (0, UserIQTestController_1.createIQTestResult)(req, res); // Use the testID for deletion
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting consultation by testID', error });
    }
});
// Route to retrieve all IQ test results for a specific user
router.get('/:userID', UserIQTestController_1.getIQTestResultsByUserID);
router.get('/', UserIQTestController_1.getIQTestResultsByAll);
router.get('/test/:testID', UserIQTestController_1.getIQTestResultsByTestID);
// Route to retrieve a specific IQ test result by test ID
router.get('/:id', UserIQTestController_1.getIQTestResultById);
// Route to update an IQ test result by test ID
router.put('/:id', UserIQTestController_1.updateIQTestResult);
// Route to delete an IQ test result by test ID
router.delete('/test/:id', UserIQTestController_1.deleteIQTestResult);
// Route to archive an IQ test result 
router.put('/archive/:testID', async (req, res) => {
    try {
        await (0, UserIQTestController_1.archiveIQTestResult)(req, res); // Use the testID for deletion
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting consultation by testID', error });
    }
});
// Route to get archived IQ test results
router.get('/isTrue/archived/all', async (req, res) => {
    try {
        await (0, UserIQTestController_1.getArchivedIQTests)(req, res); // Fetch the archived IQ test results
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching archived IQ test results', error });
    }
});
router.delete('/test/delete/:testID', async (req, res) => {
    try {
        await (0, UserIQTestController_1.deleteArchivedIQTestResult)(req, res); // Use the testID for deletion
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting consultation by testID', error });
    }
});
router.put('/unarchive/:id', async (req, res) => {
    try {
        await (0, UserIQTestController_1.unarchiveIQTestResult)(req, res); // Use the testID for deletion
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting consultation by testID', error });
    }
});
exports.default = router;
