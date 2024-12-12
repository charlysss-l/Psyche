"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express"); // Make sure to import Request and Response
const omrIQController_1 = require("../controllers/omrIQController"); // Ensure this path is correct
const router = (0, express_1.Router)();
// Route to create a new IQ test result
router.post('/', omrIQController_1.createOmrResult);
router.get('/', omrIQController_1.getIQTestResultsByAll);
// Route to retrieve all IQ test results for a specific user
router.get('/:userID', omrIQController_1.getOmrResultsByUser);
// Route to retrieve a specific IQ test result by test ID
router.get('/:id', omrIQController_1.getOmrResultById);
router.get('/test/:testID', omrIQController_1.getOmrResultsByTestID);
// Route to update an IQ test result by test ID
router.put('/test/:testID', omrIQController_1.updateOmrResult);
// Route to delete an IQ test result by test ID
router.delete('/test/:id', omrIQController_1.deleteOmrResult);
// Route to archive an IQ test result 
router.put('/archive/:testID', async (req, res) => {
    try {
        await (0, omrIQController_1.archiveIQTestResult)(req, res); // Use the testID for deletion
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting consultation by testID', error });
    }
});
// Route to get archived IQ test results
router.get('/isTrue/archived/all', async (req, res) => {
    try {
        await (0, omrIQController_1.getArchivedIQTests)(req, res); // Fetch the archived IQ test results
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching archived IQ test results', error });
    }
});
router.delete('/test/delete/:testID', async (req, res) => {
    try {
        await (0, omrIQController_1.deleteArchivedIQTestResult)(req, res); // Use the testID for deletion
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting consultation by testID', error });
    }
});
exports.default = router;
