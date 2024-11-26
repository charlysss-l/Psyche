import mongoose, { Schema, Document } from 'mongoose';

interface IConsultationRequest extends Document {
  userId: string;
  timeForConsultation: string;
  testID: string;
  note: 'IQ Test (Online)' | 'IQ Test (Physical)' | 'Personality Test (Online)' | 'Personality Test (Physical)' | 'Others';
  date: Date;
  status: 'pending' | 'accepted' | 'declined';
  firstName?: string;
  lastName?: string;
  sex?: 'Male' | 'Female';
  age?: number;
  course?: string;
  year?: 1 | 2 | 3 | 4;
  section?: number;
  reasonForConsultation?: string;
}

const ConsultationRequestSchema: Schema = new Schema({
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
  testID: {
    type: String,
    required: true,
    unique: true
  },
  note: {
    type: String,
    enum: ['IQ Test (Online)', 'IQ Test (Physical)', 'Personality Test (Online)', 'Personality Test (Physical)', 'Others'],  // Only allow these three options
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
  },
  
  // Conditional fields when 'note' is 'Others'
  firstName: {
    type: String,
    required: function(this: IConsultationRequest) {
      return this.note === 'Others';  // Only required if note is 'Others'
    }
  },
  lastName: {
    type: String,
    required: function(this: IConsultationRequest) {
      return this.note === 'Others';  // Only required if note is 'Others'
    }
  },
  age: {
    type: Number,
    required: function(this: IConsultationRequest) {
      return this.note === 'Others';  // Only required if note is 'Others'
    }
  },
  sex: {
    type: String,
    enum: ['Male', 'Female'],
    required: function(this: IConsultationRequest) {
      return this.note === 'Others';  // Only required if note is 'Others'
    }
  },
  course: {
    type: String,
    required: function(this: IConsultationRequest) {
      return this.note === 'Others';  // Only required if note is 'Others'
    }
  },
  year: {
    type: Number,
    required: function(this: IConsultationRequest) {
      return this.note === 'Others';  // Only required if note is 'Others'
    },
    enum: [1, 2, 3, 4],  // Year must be between 1 and 4
  },
  section: {
    type: Number,
    required: function(this: IConsultationRequest) {
      return this.note === 'Others';  // Only required if note is 'Others'
    },
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9],  // Section must be between 1 and 9
  },
  reasonForConsultation: {
    type: String,
    required: function(this: IConsultationRequest) {
      return this.note === 'Others';  // Only required if note is 'Others'
    }
  }
});

export const ConsultationRequest = mongoose.model<IConsultationRequest>('ConsultationRequest', ConsultationRequestSchema);
