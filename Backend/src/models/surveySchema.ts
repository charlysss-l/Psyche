// models/Survey.ts
import mongoose, { Schema, Document } from 'mongoose';

interface Survey extends Document {
  title: string;
  description: string; // New field for description
  questions: {
    questionText: string;
    choices: string[];
  }[];
}

const surveySchema = new Schema<Survey>({
  title: { type: String, required: true },
  description: { type: String, required: true }, // Add description field
  questions: [
    {
      questionText: { type: String, required: true },
      choices: { type: [String], required: true },
    },
  ],
});

const SurveyModel = mongoose.model<Survey>('Survey', surveySchema);

export default SurveyModel;
