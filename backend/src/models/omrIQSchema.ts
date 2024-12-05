import { Schema, model, Document } from 'mongoose';



// Define structure for the interpretation
export interface Interpretation {
   
    resultInterpretation: string;
}





// UserIQTest interface
interface OMR extends Document {
    userID: string;
    firstName: string;
    lastName: string;
    age: number;  // Changed from string to number
    sex: string;
    course: string;
    year: number;
    section: string;
    testID: string;
    totalScore: number; // Include totalScore here
    interpretation: Interpretation;
    testType: string;
    testDate: Date;
    isArchived: boolean
}


// Interpretation Schema
const InterpretationSchema = new Schema<Interpretation>({
    
    resultInterpretation: { type: String, required: true },
}, { _id: false });

// Main UserIQTest Schema
const OmrSchema = new Schema<OMR>({
    userID: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },  // Changed from String to Number
    sex: { type: String, required: true },
    course: { type: String, required: true },
    year: { type: Number, required: true },
    section: { type: String, required: true },
    testID: { type: String, required: true, unique: true },
    totalScore: { type: Number, required: true },  // Direct totalScore as a number
    interpretation: InterpretationSchema, 
    testType: { type: String, required: true },
    testDate: { type: Date, required: true, default: Date.now },
    isArchived: { type: Boolean, default: false }, // Default is not archived
});

// Create and export the model
export default model<OMR>('OMR', OmrSchema);