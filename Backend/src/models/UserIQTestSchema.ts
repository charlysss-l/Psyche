import { Schema, model } from 'mongoose';

export const UserIQTestSchema = new Schema({
    userID: {
        type: String,
        required: true,
    },
    testID: {
        type: String,
        required: true,
    },
    responses: [{
        questionID: {
            type: String,
            required: true,
        },
        selectedChoice: {
            type: String,
            required: true,
        },
        isCorrect: {
            type: Boolean,
            required: true,
        }
    }],
    interpretation: {
        rawScore: {
            type: Number,
            required: true,
        },
        percentileScore: {
            type: Number,
            required: true,
        },
        finalInterpretation: {
            type: String,
            required: true,
        }
    },
    testType: {
        type: String,
        required: true,
    },
    testDate: {
        type: Date,
        required: true,
        default: Date.now, // Set default to current date if not provided
    }
});

// Create and export the model
export default model('UserIQTest', UserIQTestSchema);
