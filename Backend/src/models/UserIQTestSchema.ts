import mongoose, { Schema, Document } from 'mongoose';

interface Response {
  questionID: string;
  selectedChoice: string;
  isCorrect: boolean;
}

interface Interpretation {
  rawScore: number;
  percentileScore: number;
  finalInterpretation: string;
}

interface UserIQTestSchema extends Document {
  userID: string;
  testID: string;
  responses: Response[];
  interpretation: Interpretation;
  testType: string;
  testDate: Date;
}

const responseSchema = new Schema<Response>({
  questionID: { type: String, required: true },
  selectedChoice: { type: String, required: true },
  isCorrect: { type: Boolean, required: true }
});

const interpretationSchema = new Schema<Interpretation>({
  rawScore: { type: Number, required: true },
  percentileScore: { type: Number, required: true },
  finalInterpretation: { type: String, required: true }
});

const userIQTestSchema = new Schema<UserIQTestSchema>({
  userID: { type: String, required: true },
  testID: { type: String, required: true },
  responses: { type: [responseSchema], required: true },
  interpretation: { type: interpretationSchema, required: true },
  testType: { type: String, required: true },
  testDate: { type: Date, required: true }
});

const UserIQTest = mongoose.model<UserIQTestSchema>('UserIQTest', userIQTestSchema);

export default UserIQTest;
