"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const consultationcontroller_1 = require("../controllers/consultationcontroller");
const router = express_1.default.Router();
router.post('/', async (req, res) => {
    try {
        await (0, consultationcontroller_1.createConsultationRequest)(req, res);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating survey', error });
    }
});
router.get('/', consultationcontroller_1.getConsultationRequests);
router.get('/user/:userId', consultationcontroller_1.getConsultationRequestsByUserID);
router.get('/:testID', consultationcontroller_1.getConsultationRequestsById);
router.get('/archive/status/archived', async (req, res) => {
    try {
        await (0, consultationcontroller_1.getArchivedConsultations)(req, res); // Use the id to mark as removed
    }
    catch (error) {
        res.status(500).json({ message: 'Error removing consultation by id', error });
    }
});
router.get('/archive/userId/:userId', consultationcontroller_1.getArchivedConsultationsByUserID);
router.put('/:id/accept', consultationcontroller_1.acceptConsultationRequest);
// Mark consultation request as "removed" by id (admin)
router.delete('/id/:id/delete', async (req, res) => {
    try {
        await (0, consultationcontroller_1.deleteConsultationRequestById)(req, res); // Use the id to mark as removed
    }
    catch (error) {
        res.status(500).json({ message: 'Error removing consultation by id', error });
    }
});
// Delete consultation request by testID (admin)
router.delete('/test/:testID/delete', async (req, res) => {
    try {
        await (0, consultationcontroller_1.deleteConsultationRequest)(req, res); // Use the testID for deletion
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting consultation by testID', error });
    }
});
router.put('/:testID/cancel', consultationcontroller_1.cancelConsultationRequest);
router.put('/archive/:testID', consultationcontroller_1.archiveConsultationRequest);
router.put('/:id/mark-done', async (req, res) => {
    try {
        await (0, consultationcontroller_1.markConsultationRequestAsDone)(req, res); // Use the testID for deletion
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting consultation by testID', error });
    }
});
router.put('/:id/decline', async (req, res) => {
    try {
        await (0, consultationcontroller_1.declineConsultationRequest)(req, res); // Use the testID for deletion
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting consultation by testID', error });
    }
});
router.put('/restore/:testID', consultationcontroller_1.restoreConsultationRequest);
exports.default = router;
