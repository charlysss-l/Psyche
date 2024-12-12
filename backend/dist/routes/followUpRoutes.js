"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const followUpController_1 = require("../controllers/followUpController");
const router = express_1.default.Router();
router.post("/", followUpController_1.createFollowUpSchedule);
router.get("/", followUpController_1.getAllFollowUpSchedules);
router.get("/user/:userId", followUpController_1.getFollowUpSchedulesByUserId);
router.put('/:id', async (req, res) => {
    try {
        await (0, followUpController_1.updateFollowUpScheduleById)(req, res); // Use the testID for deletion
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting consultation by testID', error });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        await (0, followUpController_1.deleteFollowUpScheduleById)(req, res); // Use the testID for deletion
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting consultation by testID', error });
    }
});
exports.default = router;
