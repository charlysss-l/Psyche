// models/surveyResponseModel.ts
import mongoose from 'mongoose';

const choiceSchema = new mongoose.Schema({
  choiceText: { type: String, required: true },
});

const surveyResponseSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }, // Reference to Student model
  surveyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Survey', required: true },   // Reference to Survey model
  responses: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },  // Question being answered
      choice: { type: String, required: true },        // Store the chosen option as a string
    },
  ],
  submittedAt: { type: Date, default: Date.now },
});

const SurveyResponse = mongoose.model('SurveyResponse', surveyResponseSchema);
export default SurveyResponse;
