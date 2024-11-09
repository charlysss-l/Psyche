"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Main interface for the Test16PF document
const Test16PFSchema = new mongoose_1.Schema({
    testID: {
        type: String,
        required: true,
    },
    nameofTest: {
        type: String,
        required: true,
    },
    numOfQuestions: {
        type: Number,
        required: true,
    },
    question: [{
            questionID: {
                type: String,
                required: true,
            },
            questionNum: {
                type: Number,
                required: true,
            },
            questionText: {
                type: String,
                required: true,
            },
            choices: {
                a: { type: String, required: true },
                b: { type: String, required: true },
                c: { type: String, required: true },
            },
            choiceEquivalentScore: {
                a: { type: Number, required: true },
                b: { type: Number, required: true },
                c: { type: Number, required: true },
            },
            factorLetter: {
                type: String,
                required: true,
            },
        }]
});
// Create and export the model
const Test16PFModel = (0, mongoose_1.model)('16PFTest', Test16PFSchema);
exports.default = Test16PFModel;
