"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowUpSchedule = void 0;
const mongoose_1 = require("mongoose");
const FollowUpScheduleSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    followUpDate: { type: String, required: true },
    timeForConsultation: { type: String, required: true },
    note: { type: String, required: true },
    status: { type: String, default: "pending" }, // Status can be "pending", "completed", etc.
    message: { type: String, default: "" },
});
exports.FollowUpSchedule = (0, mongoose_1.model)("FollowUpSchedule", FollowUpScheduleSchema);
