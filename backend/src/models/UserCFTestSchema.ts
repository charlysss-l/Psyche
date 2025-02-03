import { Schema, model, Document } from 'mongoose';

// Define the structure for Responses
export interface Response {
    questionID: string;
    selectedChoice: string;
    isCorrect: boolean;
}

// Define structure for the interpretation
export interface Interpretation {

    resultInterpretation: string;
}

// Define structure for the CF Test
interface CFTest extends Document {
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

// UserCFTest interface
interface UserCFTest extends Document {
    userID: string;
    firstName: string;
    lastName: string;
    age: number;  // Changed from string to number
    sex: 'Female' | 'Male';
    course: string;
    year: number;
    section: string;
    testID: string;
    responses: Response[];
    totalScore: number; // Include totalScore here
    interpretation: Interpretation;
    testType: 'Online' | 'Physical';
    testDate: Date;
    isArchived: boolean; // New field to track if the test result is archived

}

export interface totalScore {
    totalScore: number;
}

// Response Schema
const ResponseSchema = new Schema<Response>({
    questionID: { type: String },
    selectedChoice: { type: String },
    isCorrect: { type: Boolean},
}, { _id: false });

// Question Schema
const QuestionSchema = new Schema<Question>({
    questionID: { type: String, required: true },
    questionSet: { type: String, required: true },
    questionImage: { type: String, required: true },
    choicesImage: { type: [String], required: true },
    correctAnswer: { type: Schema.Types.Mixed, required: true },
}, { _id: false });

// Interpretation Schema
const InterpretationSchema = new Schema<Interpretation>({

    resultInterpretation: { type: String, required: true },
}, { _id: false });

// Main UserCFTest Schema
const UserCFTestSchema = new Schema<UserCFTest>({
    userID: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },  // Changed from String to Number
    sex: { type: String, enum: ['Female', 'Male'], required: true },
    course: { type: String, required: true },
    year: { type: Number, required: true },
    section: { type: String, required: true },
    testID: { type: String, required: true, unique: true },
    responses: [ResponseSchema],
    totalScore: { type: Number, required: true },  // Direct totalScore as a number
    interpretation: InterpretationSchema, 
    testType: { type: String, enum: ['Online', 'Physical'], required: true },
    testDate: { type: Date, required: true, default: Date.now },
    isArchived: { type: Boolean, default: false }, // Default is not archived

});

// Create and export the model
export default model<UserCFTest>('UserCFTest', UserCFTestSchema);
