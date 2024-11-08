import mongoose, { Schema, Document } from 'mongoose';

interface IConsultationRequest extends Document {
  userId: string;
  timeForConsultation: string;
<<<<<<< Updated upstream
  note: string;
=======
  note: 'IQ Test' | 'Personality Test' | 'Others';
>>>>>>> Stashed changes
  permissionForTestResults: boolean;
  date: Date;
  status: 'pending' | 'accepted' | 'declined';
}

const ConsultationRequestSchema: Schema = new Schema({
<<<<<<< Updated upstream
  userId: { type: String, required: true },
  timeForConsultation: { type: String, required: true },
  note: { type: String, required: true },
  permissionForTestResults: { type: Boolean, required: true },
  date: { type: Date, required: true },
  status: { type: String, default: 'pending' }
=======
  userId: {
    type: String,
    required: true,
    match: /^[0-9]{8}$/,  // Validate that userId is 8 digits
  },
  timeForConsultation: {
    type: String,
    required: true,
    match: /^(?:[01]\d|2[0-3]):(?:[0-5]\d)$/,  // Validate time format (HH:mm)
  },
  note: {
    type: String,
    enum: ['IQ Test', 'Personality Test', 'Others'],  // Only allow these three options
    required: true,
  },
  permissionForTestResults: {
    type: Boolean,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'accepted', 'declined'],  // Status can only be one of these
  }
>>>>>>> Stashed changes
});

export const ConsultationRequest = mongoose.model<IConsultationRequest>('ConsultationRequest', ConsultationRequestSchema);
