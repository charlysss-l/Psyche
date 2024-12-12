"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Response Schema
const ResponseSchema = new mongoose_1.Schema({
    questionID: { type: String, required: true },
    selectedChoice: { type: String, enum: ['a', 'b', 'c'], required: true },
    equivalentScore: { type: Number, required: true },
    factorLetter: { type: String, required: true },
}, { _id: false });
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
// Main User16PFTest Schema
const User16PFTestSchema = new mongoose_1.Schema({
    userID: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: String, required: true },
    sex: { type: String, enum: ['Female', 'Male'], required: true },
    course: { type: String, required: true },
    year: { type: Number, required: true },
    section: { type: String, required: true },
    testID: { type: String, required: true, unique: true },
    responses: [ResponseSchema],
    scoring: ScoringSchema, // This now refers to a Scoring object
    testType: { type: String, enum: ['Online', 'Physical'], required: true },
    testDate: { type: Date, required: true, default: Date.now },
    isArchived: { type: Boolean, required: true, default: false },
});
User16PFTestSchema.index({ userID: 1 }); // Remove unique index if you want to allow duplicates
// Export the model and interfaces
exports.default = (0, mongoose_1.model)('User16PFTest', User16PFTestSchema);
