"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Response Schema
const ResponseSchema = new mongoose_1.Schema({
    questionID: { type: String },
    selectedChoice: { type: String },
    isCorrect: { type: Boolean },
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
    resultInterpretation: { type: String, required: true },
}, { _id: false });
// Main UserIQTest Schema
const UserIQTestSchema = new mongoose_1.Schema({
    userID: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true }, // Changed from String to Number
    sex: { type: String, enum: ['Female', 'Male'], required: true },
    course: { type: String, required: true },
    year: { type: Number, required: true },
    section: { type: String, required: true },
    testID: { type: String, required: true, unique: true },
    responses: [ResponseSchema],
    totalScore: { type: Number, required: true }, // Direct totalScore as a number
    interpretation: InterpretationSchema,
    testType: { type: String, enum: ['Online', 'Physical'], required: true },
    testDate: { type: Date, required: true, default: Date.now },
    isArchived: { type: Boolean, default: false }, // Default is not archived
});
// Create and export the model
exports.default = (0, mongoose_1.model)('UserIQTest', UserIQTestSchema);
