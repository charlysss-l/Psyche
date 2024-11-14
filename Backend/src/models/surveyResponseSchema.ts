// models/surveyResponseModel.ts
import mongoose from 'mongoose';

const choiceSchema = new mongoose.Schema({
  choiceText: { type: String, required: true },
});

const surveyResponseSchema = new mongoose.Schema({
  surveyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Survey', required: true },
  userId: { type: String, required: true },  // Add userId field here
  responses: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
      choice: { type: String, required: true },
    },
  ],
  submittedAt: { type: Date, default: Date.now },
});

const SurveyResponse = mongoose.model('SurveyResponse', surveyResponseSchema);
export default SurveyResponse;
