import { Request, Response } from "express";
import { FollowUpSchedule } from "../models/followUpSchema";

// Create a follow-up schedule
export const createFollowUpSchedule = async (req: Request, res: Response) => {
  try {
    const { userId, studentName, councelorName, followUpDate, timeForConsultation, note } = req.body;
    const newSchedule = new FollowUpSchedule({ userId, studentName, councelorName, followUpDate, timeForConsultation, note });
    await newSchedule.save();
    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(500).json({ message: "Error creating follow-up schedule", error });
  }
};

// Get all follow-up schedules
export const getAllFollowUpSchedules = async (_req: Request, res: Response) => {
  try {
    const schedules = await FollowUpSchedule.find();
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Error fetching follow-up schedules", error });
  }
};

// Get all follow-up schedule by userId
export const getFollowUpSchedulesByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const schedules = await FollowUpSchedule.find({ userId });
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Error fetching follow-up schedules", error });
  }
};


// Update follow-up schedule by ID
export const updateFollowUpScheduleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedSchedule = await FollowUpSchedule.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedSchedule) return res.status(404).json({ message: "Schedule not found" });
    res.status(200).json(updatedSchedule);
  } catch (error) {
    res.status(500).json({ message: "Error updating follow-up schedule", error });
  }
};

// Delete follow-up schedule by ID
export const deleteFollowUpScheduleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedSchedule = await FollowUpSchedule.findByIdAndDelete(id);
    if (!deletedSchedule) return res.status(404).json({ message: "Schedule not found" });
    res.status(200).json({ message: "Schedule deleted", deletedSchedule });
  } catch (error) {
    res.status(500).json({ message: "Error deleting follow-up schedule", error });
  }
};
