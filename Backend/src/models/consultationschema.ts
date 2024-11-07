import mongoose, { Schema, Document } from 'mongoose';

interface IConsultationRequest extends Document {
  userId: string;
  timeForConsultation: string;
  note: string;
  permissionForTestResults: boolean;
  date: Date;
  status: 'pending' | 'accepted' | 'declined';
}

const ConsultationRequestSchema: Schema = new Schema({
  userId: { type: String, required: true },
  timeForConsultation: { type: String, required: true },
  note: { type: String, required: true },
  permissionForTestResults: { type: Boolean, required: true },
  date: { type: Date, required: true },
  status: { type: String, default: 'pending' }
});

export const ConsultationRequest = mongoose.model<IConsultationRequest>('ConsultationRequest', ConsultationRequestSchema);
