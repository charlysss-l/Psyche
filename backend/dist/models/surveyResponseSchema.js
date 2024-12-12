"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const choiceSchema = new mongoose_1.default.Schema({
    choiceText: { type: String, required: true },
});
const surveyResponseSchema = new mongoose_1.default.Schema({
    surveyId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Survey', required: true },
    userId: { type: String, required: true },
    responses: [
        {
            questionId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Question' },
            choice: { type: String, required: true },
        },
    ],
    submittedAt: { type: Date, default: Date.now },
    isArchived: { type: Boolean, default: true },
});
const SurveyResponse = mongoose_1.default.model('SurveyResponse', surveyResponseSchema);
exports.default = SurveyResponse;
