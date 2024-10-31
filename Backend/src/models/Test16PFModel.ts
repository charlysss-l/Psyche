import { Schema, model, Document } from 'mongoose';

// Define interfaces for the schema
interface Choice {
    a: string;
    b: string;
    c: string;
}

interface ChoiceEquivalentScore {
    a: number;
    b: number;
    c: number;
}

interface Question {
    questionID: string;
    questionNum: number;
    questionText: string;
    choices: Choice;
    choiceEquivalentScore: ChoiceEquivalentScore;
}

interface RawTostenMapping {
    factorLetter: string;
    computationOfRawScore: string;
    rawScore: number;
    equivalentStenScore: number;
}

// Main interface for the Test16PF document
interface Test16PF extends Document {
    testID: string;
    nameofTest: string;
    numOfQuestions: number;
    question: Question[];
    rawTostenMapping: RawTostenMapping[];
}

// Create the schema
const Test16PFSchema = new Schema<Test16PF>({
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

// Create and export the model
const Test16PFModel = model<Test16PF>('16PFTest', Test16PFSchema);
export default Test16PFModel;
