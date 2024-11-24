import { Schema, model, Document } from 'mongoose';

// Interface for scoring object
interface Scoring {
    factorLetter: string;
    rawScore: number;
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
}

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
    scoring: [
        {
            factorLetter: { type: String, required: true },
            rawScore: { type: Number, required: true }
        }
    ],
    testType: { type: String, required: true },
    testDate: { type: Date, required: true, default: Date.now },
});

// Create and export the model
export default model<OMRpf>('OMRpf', OmrPFSchema);
