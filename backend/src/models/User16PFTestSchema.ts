import { Schema, model, Document } from 'mongoose';

interface Response {
    questionID: string; 
    selectedChoice: 'a' | 'b' | 'c'; 
    equivalentScore: number;
    factorLetter: string;  
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
    responses: Response[]; 
    scoring: Scoring;  // Change to a single scoring object
    testType: 'Online' | 'Physical';
}

// Update the Response schema to include factorLetter
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
    },
    factorLetter: {  
        type: String,
        required: true,
    }
}, { _id: false });


// Update the Scoring schema to represent a single scoring object
const ScoringSchema = new Schema<Scoring>({
    rawScore: {
        type: Number,
        required: true,
        default: 0,  
    },
    stenScore: {
        type: Number,
        required: true,
        default: 1,  
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
    responses: [ResponseSchema],
    scoring: ScoringSchema,  // Change to a single scoring object
    testType: { type: String, enum: ['Online', 'Physical'], required: true },
});

// Export the model
export default model<User16PFTest>('User16PFTest', User16PFTestSchema);
