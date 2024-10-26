import { Schema, model } from 'mongoose';


export const Test16PF = new Schema({
    testID: {
        type: String,
        required: true,
    },
    nameofTest: {
        type: String,
        required: true
    },
    numOfQuestions: {
        type: Number,
        required: true
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
    }],
    rawTostenMapping: [{
        factorLetter: {
            type: String,
            required: true,
        },
        computationOfRawScore: {
            type: String,
            required: true,
        },
        rawScore: {
            type: Number,
            required: true,
        },
        equivalentStenScore: {
            type: Number,
            required: true,
        },
    }],
});

export default model('16PFTest', Test16PF);
