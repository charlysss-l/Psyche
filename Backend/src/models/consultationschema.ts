import mongoose, { Schema, Document } from 'mongoose';

interface IConsultationRequest extends Document {
  userId: string;
  email: string;
  studentName: string;
  councelorName: string;
  consultationType: string;
  timeForConsultation: string;
  testID: string;
  note: 'IQ Test (Online)' | 'IQ Test (Physical)' | 'Personality Test (Online)' | 'Personality Test (Physical)' | "CF Test (Online)" | "CF Test (Physical)" | 'Others';
  date: Date;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled' | 'completed' | 'deleted' | 'removed' | 'archived';
  message: string;
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
  },
  email: {
    type: String,
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  councelorName: {
    type: String,
    required: true,
  },
  consultationType: {
    type: String,
    required: true,
  },
  timeForConsultation: {
    type: String,
    required: true,
  },
  testID: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    enum: ['IQ Test (Online)', 'IQ Test (Physical)', 'Personality Test (Online)', 'Personality Test (Physical)', "CF Test (Online)" , "CF Test (Physical)" , 'Others'], // Only allow these options
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'accepted', 'declined', 'cancelled', 'completed', 'deleted' , 'removed' , 'archived'], // Status can only be one of these
  },
  message: {
    type: String,
    required: true,
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
