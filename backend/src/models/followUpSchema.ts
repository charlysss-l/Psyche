import { Schema, model, Document } from "mongoose";

interface IFollowUpSchedule extends Document {
  userId: string;
  followUpDate: string;
  timeForConsultation: string;
  note: string;
  status: string;
  message: string;
}

const FollowUpScheduleSchema = new Schema<IFollowUpSchedule>({
  userId: { type: String, required: true },
  followUpDate: { type: String, required: true },
  timeForConsultation: { type: String, required: true },
  note: { type: String, required: true },
  status: { type: String, default: "pending" }, // Status can be "pending", "completed", etc.
  message: { type: String, default: "" },
});

export const FollowUpSchedule = model<IFollowUpSchedule>("FollowUpSchedule", FollowUpScheduleSchema);
