"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFollowUpScheduleById = exports.updateFollowUpScheduleById = exports.getFollowUpSchedulesByUserId = exports.getAllFollowUpSchedules = exports.createFollowUpSchedule = void 0;
const followUpSchema_1 = require("../models/followUpSchema");
// Create a follow-up schedule
const createFollowUpSchedule = async (req, res) => {
    try {
        const { userId, followUpDate, timeForConsultation, note } = req.body;
        const newSchedule = new followUpSchema_1.FollowUpSchedule({ userId, followUpDate, timeForConsultation, note });
        await newSchedule.save();
        res.status(201).json(newSchedule);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating follow-up schedule", error });
    }
};
exports.createFollowUpSchedule = createFollowUpSchedule;
// Get all follow-up schedules
const getAllFollowUpSchedules = async (_req, res) => {
    try {
        const schedules = await followUpSchema_1.FollowUpSchedule.find();
        res.status(200).json(schedules);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching follow-up schedules", error });
    }
};
exports.getAllFollowUpSchedules = getAllFollowUpSchedules;
// Get all follow-up schedule by userId
const getFollowUpSchedulesByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const schedules = await followUpSchema_1.FollowUpSchedule.find({ userId });
        res.status(200).json(schedules);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching follow-up schedules", error });
    }
};
exports.getFollowUpSchedulesByUserId = getFollowUpSchedulesByUserId;
// Update follow-up schedule by ID
const updateFollowUpScheduleById = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedSchedule = await followUpSchema_1.FollowUpSchedule.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedSchedule)
            return res.status(404).json({ message: "Schedule not found" });
        res.status(200).json(updatedSchedule);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating follow-up schedule", error });
    }
};
exports.updateFollowUpScheduleById = updateFollowUpScheduleById;
// Delete follow-up schedule by ID
const deleteFollowUpScheduleById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSchedule = await followUpSchema_1.FollowUpSchedule.findByIdAndDelete(id);
        if (!deletedSchedule)
            return res.status(404).json({ message: "Schedule not found" });
        res.status(200).json({ message: "Schedule deleted", deletedSchedule });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting follow-up schedule", error });
    }
};
exports.deleteFollowUpScheduleById = deleteFollowUpScheduleById;
