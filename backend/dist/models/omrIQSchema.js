"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Interpretation Schema
const InterpretationSchema = new mongoose_1.Schema({
    resultInterpretation: { type: String, required: true },
}, { _id: false });
// Main UserIQTest Schema
const OmrSchema = new mongoose_1.Schema({
    userID: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true }, // Changed from String to Number
    sex: { type: String, required: true },
    course: { type: String, required: true },
    year: { type: Number, required: true },
    section: { type: String, required: true },
    testID: { type: String, required: true, unique: true },
    totalScore: { type: Number, required: true }, // Direct totalScore as a number
    interpretation: InterpretationSchema,
    testType: { type: String, required: true },
    testDate: { type: Date, required: true, default: Date.now },
    isArchived: { type: Boolean, default: false }, // Default is not archived
    uploadURL: { type: String, required: true },
});
// Create and export the model
exports.default = (0, mongoose_1.model)('OMR', OmrSchema);
