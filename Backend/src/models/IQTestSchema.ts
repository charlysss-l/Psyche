import { Schema, model } from 'mongoose';

export const IQTestSchema = new Schema({
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
        }], // Making choicesImage an array of strings
        correctAnswer: {
            type: String,
            required: true,
        }
    }],
    interpretation: [{
        ageRange: {
            type: String,  // Use String if the range will be stored as "5-7" format
            required: true,
        },
        sex:{
            type:String,
            enum: ['Female', 'Male'],
            required: true
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
        }
    }] // Making interpretation an array, allowing for multiple interpretations
});

// Create and export the model
export default model('IQTest', IQTestSchema);