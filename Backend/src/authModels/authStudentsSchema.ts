import { Schema, model, Document } from 'mongoose';

export interface IStudent extends Document {
    email: string;
    password: string;
    studentNumber: string;
    userId: string; // 8 digit number
}

const StudentSchema = new Schema<IStudent>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    studentNumber: { type: String, unique: true, required: true },
    userId: { type: String, required: true, unique: true, length: 8 },
});

const Student = model<IStudent>('Student', StudentSchema);

export default Student;
