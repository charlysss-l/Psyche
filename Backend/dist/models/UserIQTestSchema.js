"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Response Schema
const ResponseSchema = new mongoose_1.Schema({
    questionID: { type: String, required: true },
    selectedChoice: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
}, { _id: false });
// Question Schema
const QuestionSchema = new mongoose_1.Schema({
    questionID: { type: String, required: true },
    questionSet: { type: String, required: true },
    questionImage: { type: String, required: true },
    choicesImage: { type: [String], required: true },
    correctAnswer: { type: String, required: true },
}, { _id: false });
// Interpretation Schema
const InterpretationSchema = new mongoose_1.Schema({
    ageRange: { type: String, required: true },
    sex: { type: String, enum: ['Female', 'Male'], required: true },
    minTestScore: { type: Number, required: true },
    maxTestScore: { type: Number, required: true },
    percentilePoints: { type: Number, required: true },
    resultInterpretation: { type: String, required: true },
}, { _id: false });
// Main UserIQTest Schema
const UserIQTestSchema = new mongoose_1.Schema({
    userID: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: String, required: true },
    sex: { type: String, enum: ['Female', 'Male'], required: true },
    testID: { type: String, required: true, unique: true },
    responses: [ResponseSchema],
    totalScore: { type: Number, required: true }, // Direct totalScore as a number
    interpretation: InterpretationSchema,
    testType: { type: String, enum: ['Online', 'Physical'], required: true },
    testDate: { type: Date, required: true, default: Date.now },
});
// Create and export the model
exports.default = (0, mongoose_1.model)('UserIQTest', UserIQTestSchema);
