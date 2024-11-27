import mongoose, { Schema, Document } from 'mongoose';

interface IConsultationRequest extends Document {
  userId: string;
  timeForConsultation: string;
  testID: string;
  note: 'IQ Test (Online)' | 'IQ Test (Physical)' | 'Personality Test (Online)' | 'Personality Test (Physical)' | 'Others';
  date: Date;
  status: 'pending' | 'accepted' | 'declined';
  message: string;
  firstName?: string;
  lastName?: string;
  sex?: string;
  age?: number;
  course?: string;
  year?: number;
  section?: number;
  reasonForConsultation?: string;
}

const ConsultationRequestSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    match: /^[0-9]{8}$/, // Validate that userId is 8 digits
  },
  timeForConsultation: {
    type: String,
    required: true,
    match: /^(?:[01]\d|2[0-3]):(?:[0-5]\d)$/, // Validate time format (HH:mm)
  },
  testID: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    enum: ['IQ Test (Online)', 'IQ Test (Physical)', 'Personality Test (Online)', 'Personality Test (Physical)', 'Others'], // Only allow these options
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'accepted', 'declined'], // Status can only be one of these
  },
  message: {
    type: String,
    required: true,
  },
  firstName: {
    type: String, // Optional field
  },
  lastName: {
    type: String, // Optional field
  },
  age: {
    type: Number, // Optional field
  },
  sex: {
    type: String,
  },
  course: {
    type: String, // Optional field
  },
  year: {
    type: Number,
  },
  section: {
    type: Number,
  },
  reasonForConsultation: {
    type: String, // Optional field
  },
});

export const ConsultationRequest = mongoose.model<IConsultationRequest>(
  'ConsultationRequest',
  ConsultationRequestSchema
);
