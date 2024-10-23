import {Schema, model} from 'mongoose';

export const User16PFTestSchema = new Schema({
    userID:{
        //type:mongoose.Schema.Types.ObjectId,
        //ref: 'User'
        type:String,
        required: true
    },
    testID:{
        //type:mongoose.Schema.Types.ObjectId,
        //ref: 'Test'
        type:String,
        required: true,
    },
    responses:[{
        questionID:{
            type: String,
            required:true
        },
        selectedChoice:{
            type:String,
            required:true,
        },
        equivalentScore:{
            type:Number,
            required:true,
        }
    }],
    scoring:[{
        rawScore:{
            type:Number,
            required:true,
        },
        stenScore:{
            type:Number,
            required:true,
        }
    }],
    testType:{
        type:String,
        enum: ['Online', 'Physical'],
        required: true,
    }
});

export default model('User16PFTest',User16PFTestSchema );
