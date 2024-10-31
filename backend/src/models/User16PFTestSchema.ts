import { Schema, model, Document } from 'mongoose';
interface Response {
    questionID: string; 
    selectedChoice: 'a' | 'b' | 'c'; 
    equivalentScore: number;
}

interface Scoring {
    rawScore: number;
    stenScore: number;
}

interface User16PFTest extends Document {
    userID: string;
    firstName: string;
    lastName: string;
    age: string;
    sex: 'Female' | 'Male';
    courseSection: string;
    testID: Schema.Types.ObjectId; 
    responses: Response[]; 
    scoring: Scoring[]; 
    testType: 'Online' | 'Physical';
}


const ResponseSchema = new Schema<Response>({
    questionID: {
        type: String,
        required: true,
    },
    selectedChoice: {
        type: String,
        enum: ['a', 'b', 'c'], 
        required: true,
    },
    equivalentScore: {
        type: Number,
        required: true,
    }
}, { _id: false }); 

const ScoringSchema = new Schema<Scoring>({
    rawScore: {
        type: Number,
        required: true,
    },
    stenScore: {
        type: Number,
        required: true,
    }
}, { _id: false }); 

// Main schema
const User16PFTestSchema = new Schema<User16PFTest>({
    userID: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: String, required: true },
    sex: { type: String, enum: ['Female', 'Male'], required: true },
    courseSection: { type: String, required: true },
    testID: { type: String, required: true }, // Ensure this is set to String
    responses: [ResponseSchema],
    scoring: [ScoringSchema],
    testType: { type: String, enum: ['Online', 'Physical'], required: true },
});



export default model<User16PFTest>('User16PFTest', User16PFTestSchema);
