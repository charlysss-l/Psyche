import { Schema, model, Document } from 'mongoose';

// Define the structure for Responses
interface Response {
    questionID: string; 
    selectedChoice: 'a' | 'b' | 'c'; 
    equivalentScore: number;
    factorLetter: string;  
}

// Define structure for a single score entry
export interface ScoreEntry {
    factorLetter: string;
    rawScore: number;
    stenScore: number;
}

// Update the Scoring schema to hold an array of score entries
export interface Scoring {
    scores: ScoreEntry[]; 
}

// User16PFTest interface
interface User16PFTest extends Document {
    userID: string;
    firstName: string;
    lastName: string;
    age: string;
    sex: 'Female' | 'Male';
    course: string;
    year: number;
    section: number;
    testID: string;
    responses: Response[]; 
    scoring: Scoring; 
    testType: 'Online' | 'Physical';
    testDate: Date;
    isArchived: boolean;
}

// Response Schema
const ResponseSchema = new Schema<Response>({
    questionID: { type: String, required: true },
    selectedChoice: { type: String, enum: ['a', 'b', 'c'], required: true },
    equivalentScore: { type: Number, required: true },
    factorLetter: { type: String, required: true },
}, { _id: false });

// ScoreEntry Schema
const ScoreEntrySchema = new Schema<ScoreEntry>({
    factorLetter: { type: String, required: true },
    rawScore: { type: Number, required: true, default: 0 },
    stenScore: { type: Number, required: true, default: 1 },
}, { _id: false });

// Scoring Schema
const ScoringSchema = new Schema<Scoring>({
    scores: [ScoreEntrySchema], 
}, { _id: false });

// Main User16PFTest Schema
const User16PFTestSchema = new Schema<User16PFTest>({
    userID: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: String, required: true },
    sex: { type: String, enum: ['Female', 'Male'], required: true },
    course: { type: String, required: true },
    year: { type: Number, required: true },
    section: { type: Number, required: true },
    testID: { type: String, required: true, unique: true },
    responses: [ResponseSchema],
    scoring: ScoringSchema, // This now refers to a Scoring object
    testType: { type: String, enum: ['Online', 'Physical'], required: true },
    testDate: { type: Date, required: true, default: Date.now },
    isArchived: { type: Boolean, required: true, default: false },
});

User16PFTestSchema.index({ userID: 1 }); // Remove unique index if you want to allow duplicates

// Export the model and interfaces
export default model<User16PFTest>('User16PFTest', User16PFTestSchema);
