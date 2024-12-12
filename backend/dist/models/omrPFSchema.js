"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// ScoreEntry Schema
const ScoreEntrySchema = new mongoose_1.Schema({
    factorLetter: { type: String, required: true },
    rawScore: { type: Number, required: true, default: 0 },
    stenScore: { type: Number, required: true, default: 1 },
}, { _id: false });
// Scoring Schema
const ScoringSchema = new mongoose_1.Schema({
    scores: [ScoreEntrySchema],
}, { _id: false });
// Main UserIQTest Schema
const OmrPFSchema = new mongoose_1.Schema({
    userID: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    sex: { type: String, required: true },
    course: { type: String, required: true },
    year: { type: Number, required: true },
    section: { type: String, required: true },
    testID: { type: String, required: true, unique: true },
    scoring: ScoringSchema, // This now refers to a Scoring object
    testType: { type: String, required: true },
    testDate: { type: Date, required: true, default: Date.now },
    isArchived: { type: Boolean, default: false },
    uploadURL: { type: String, required: true },
});
// Create and export the model
exports.default = (0, mongoose_1.model)('OMRpf', OmrPFSchema);
