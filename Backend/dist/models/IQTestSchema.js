"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Create the schema
const IQTestSchema = new mongoose_1.Schema({
    testID: {
        type: String,
        required: true,
    },
    nameOfTest: {
        type: String,
        required: true,
    },
    numOfQuestions: {
        type: Number,
        required: true,
    },
    questions: [{
            questionID: {
                type: String,
                required: true,
            },
            questionSet: {
                type: String,
                required: true,
            },
            questionImage: {
                type: String,
                required: true,
            },
            choicesImage: [{
                    type: String,
                    required: true,
                }],
            correctAnswer: {
                type: String,
                required: true,
            },
        }],
    interpretation: [{
            ageRange: {
                type: String,
                required: true,
            },
            sex: {
                type: String,
                enum: ['Female', 'Male'],
                required: true,
            },
            minTestScore: {
                type: Number,
                required: true,
            },
            maxTestScore: {
                type: Number,
                required: true,
            },
            percentilePoints: {
                type: Number,
                required: true,
            },
            resultInterpretation: {
                type: String,
                required: true,
            },
        }],
});
// Create and export the model
const IQTestModel = (0, mongoose_1.model)('IQTest', IQTestSchema);
exports.default = IQTestModel;
