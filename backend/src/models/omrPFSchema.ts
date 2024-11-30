import { Schema, model, Document } from 'mongoose';

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

// UserIQTest interface
interface OMRpf extends Document {
    userID: string;
    firstName: string;
    lastName: string;
    age: number;  // Changed from string to number
    sex: string;
    course: string;
    year: number;
    section: number;
    testID: string;
    scoring: Scoring[]; // Store an array of factorLetter and rawScore pairs
    testType: string;
    testDate: Date;
    isArchived: boolean;
}

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

// Main UserIQTest Schema
const OmrPFSchema = new Schema<OMRpf>({
    userID: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    sex: { type: String, required: true },
    course: { type: String, required: true },
    year: { type: Number, required: true },
    section: { type: Number, required: true },
    testID: { type: String, required: true, unique: true },
    scoring: ScoringSchema, // This now refers to a Scoring object
    testType: { type: String, required: true },
    testDate: { type: Date, required: true, default: Date.now },
    isArchived: { type: Boolean, default: false },
});

// Create and export the model
export default model<OMRpf>('OMRpf', OmrPFSchema);
