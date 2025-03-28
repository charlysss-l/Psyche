import { Schema, model, Document } from 'mongoose';

interface Question {
    questionID: string;
    questionSet: string;
    questionImage: string;
    choicesImage: string[]; // Array of strings representing choices images
    correctAnswer: string | string[]; // Single answer or two correct answers
}

interface Interpretation {
    byId: string; // This will automatically be assigned by MongoDB
    minAge: number;  
    maxAge: number;
    minTestScore: number;
    maxTestScore: number;
    iqScore: number;
    percentilePoints: number;
    resultInterpretation: string;
}

// Main interface for the CF Test document
interface CFTest extends Document {
    testID: string;
    nameOfTest: string;
    numOfQuestions: number;
    questions: Question[];
    interpretation: Interpretation[];
}

// Create the schema
const CFTestSchema = new Schema<CFTest>({
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
            type: Schema.Types.Mixed, // Allows string or array
            required: true,
            validate: {
                validator: function (this: any, value: string | string[]) {
                    if (this.questionSet === 'Test 2') {
                        return Array.isArray(value) && value.length === 2 && value.every(ans => this.choicesImage.includes(ans));
                    } else {
                        return typeof value === 'string' && this.choicesImage.includes(value);
                    }
                },
                message: 'Correct answer must be valid: Test 2 requires two answers, others require one.',
            },
        },
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
        iqScore: {
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
const CFTestModel = model<CFTest>('CFTest', CFTestSchema);
export default CFTestModel;