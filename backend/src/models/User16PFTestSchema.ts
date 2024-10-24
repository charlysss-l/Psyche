import { Schema, model } from 'mongoose';

export const User16PFTestSchema = new Schema({
    userID: {
        type: String,
        required: true,
    },
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required:true
    },
    age:{
        type: String,
        required:true
    },
    sex:{
        type:String,
        enum: ['Female', 'Male'],
        required: true
    },
    courseSection:{
        type:String,
        required:true
    },
    testID: {
        type: String,
        required: true,
    },
    responses: [{
        questionID: {
            type: String,
            required: true
        },
        selectedChoice: {
            type: String,
            required: true,
        },
        equivalentScore: {
            type: Number,
            required: true,
        }
    }],
    scoring: [{
        rawScore: {
            type: Number,
            required: true,
        },
        stenScore: {
            type: Number,
            required: true,
        }
    }],
    testType: {
        type: String,
        enum: ['Online', 'Physical'],
        required: true,
    }
});

export default model('User16PFTest', User16PFTestSchema);
