import { Schema, model, Document } from 'mongoose';

// Define the structure for Responses
export interface Response {
    questionID: string;
    selectedChoice: string;
    isCorrect: boolean;
}

// Define structure for the interpretation
export interface Interpretation {
    ageRange: string;
    sex: 'Female' | 'Male';
    minTestScore: number;
    maxTestScore: number;
    percentilePoints: number;
    resultInterpretation: string;
}

// Define structure for the IQ Test
interface IQTest extends Document {
    testID: string;
    nameOfTest: string;
    numOfQuestions: number;
    questions: Question[];
}

// Define structure for a single question
interface Question {
    questionID: string;
    questionSet: string;
    questionImage: string;
    choicesImage: string[];
    correctAnswer: string;
}

// UserIQTest interface
interface UserIQTest extends Document {
    userID: string;
    firstName: string;
    lastName: string;
    age: number;  // Changed from string to number
    sex: 'Female' | 'Male';
    testID: string;
    responses: Response[];
    totalScore: number; // Include totalScore here
    interpretation: Interpretation;
    testType: 'Online' | 'Physical';
    testDate: Date;
}

export interface totalScore {
    totalScore: number;
}

// Response Schema
const ResponseSchema = new Schema<Response>({
    questionID: { type: String, required: true },
    selectedChoice: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
}, { _id: false });

// Question Schema
const QuestionSchema = new Schema<Question>({
    questionID: { type: String, required: true },
    questionSet: { type: String, required: true },
    questionImage: { type: String, required: true },
    choicesImage: { type: [String], required: true },
    correctAnswer: { type: String, required: true },
}, { _id: false });

// Interpretation Schema
const InterpretationSchema = new Schema<Interpretation>({
    ageRange: { type: String, required: true },
    sex: { type: String, enum: ['Female', 'Male'], required: true },
    minTestScore: { type: Number, required: true },
    maxTestScore: { type: Number, required: true },
    percentilePoints: { type: Number, required: true },
    resultInterpretation: { type: String, required: true },
}, { _id: false });

// Main UserIQTest Schema
const UserIQTestSchema = new Schema<UserIQTest>({
    userID: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },  // Changed from String to Number
    sex: { type: String, enum: ['Female', 'Male'], required: true },
    testID: { type: String, required: true, unique: true },
    responses: [ResponseSchema],
    totalScore: { type: Number, required: true },  // Direct totalScore as a number
    interpretation: InterpretationSchema, 
    testType: { type: String, enum: ['Online', 'Physical'], required: true },
    testDate: { type: Date, required: true, default: Date.now },
});

// Create and export the model
export default model<UserIQTest>('UserIQTest', UserIQTestSchema);
