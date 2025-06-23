import { Schema, model, Document } from 'mongoose';

interface Question {
    questionID: string;
    questionSet: string;
    questionImage: string;
    choicesImage: string[]; // Array of strings representing choices images
    correctAnswer: string[]; // ✅ Now an array of strings
}

interface Interpretation {
    byId: string;
    minAge: number;  
    maxAge: number;
    minTestScore: number;
    maxTestScore: number;
    percentilePoints: number;
    resultInterpretation: string;
}

interface IQTest extends Document {
    testID: string;
    nameOfTest: string;
    numOfQuestions: number;
    questions: Question[];
    interpretation: Interpretation[];
}

const IQTestSchema = new Schema<IQTest>({
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
        correctAnswer: [{  // ✅ Now an array of strings
            type: String,
            required: true,
        }],
    }],
    interpretation: [{
        byId: {
            type: String,
            required: true,
        },
        minAge: {
            type: Number,
            required: true,
        },
        maxAge: {
            type: Number,
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

const IQTestModel = model<IQTest>('IQTest', IQTestSchema);
export default IQTestModel;
