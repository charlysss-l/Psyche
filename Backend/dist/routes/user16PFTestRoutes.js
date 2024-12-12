"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user16PFTestController_1 = require("../controllers/user16PFTestController");
const router = express_1.default.Router();
router.post('/', async (req, res) => {
    try {
        await (0, user16PFTestController_1.createUser16PFTest)(req, res);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating survey', error });
    }
});
router.get('/user/:userID', async (req, res) => {
    try {
        await (0, user16PFTestController_1.getUser16PFTestByUserId)(req, res);
    }
    catch (error) {
        res.status(500).json({ message: 'Error getting test', error });
    }
});
router.get('/test/:testID', async (req, res) => {
    try {
        await (0, user16PFTestController_1.getUser16PFTestByTestID)(req, res);
    }
    catch (error) {
        res.status(500).json({ message: 'Error getting test', error });
    }
});
router.get('/', user16PFTestController_1.getUser16PFTests);
router.get('/:id', user16PFTestController_1.getUser16PFTestById);
router.put('/:id', user16PFTestController_1.updateUser16PFTest);
router.delete('/test/:id', user16PFTestController_1.deleteUser16PFTest);
// Route to archive an IQ test result 
router.put('/archive/:testID', async (req, res) => {
    try {
        await (0, user16PFTestController_1.archivePFTestResult)(req, res); // Use the testID for deletion
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting consultation by testID', error });
    }
});
// Route to get archived IQ test results
router.get('/isTrue/archived/all', async (req, res) => {
    try {
        await (0, user16PFTestController_1.getArchivedPFTests)(req, res); // Fetch the archived IQ test results
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching archived IQ test results', error });
    }
});
router.delete('/test/delete/:testID', async (req, res) => {
    try {
        await (0, user16PFTestController_1.deleteArchivedPFTestResult)(req, res); // Use the testID for deletion
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting consultation by testID', error });
    }
});
exports.default = router;
