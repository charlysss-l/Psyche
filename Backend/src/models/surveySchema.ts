import mongoose, { Schema, Document } from 'mongoose';

interface Survey extends Document {
  title: string;
  description: string;
  sections: {
    sectionTitle: string;  // Title for the section
    questions: {
      questionText: string;
      choices: string[];
    }[];
  }[];
}

const surveySchema = new Schema<Survey>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  sections: [
    {
      sectionTitle: { type: String, required: true },  // Add sectionTitle field
      questions: [
        {
          questionText: { type: String, required: true },
          choices: { type: [String], required: true },
        },
      ],
    },
  ],
});

const SurveyModel = mongoose.model<Survey>('Survey', surveySchema);

export default SurveyModel;