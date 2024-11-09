// authPsychSchema.ts
import { Schema, model, Document } from 'mongoose';

export interface IUserPsych extends Document {
  email: string;
  password: string;
  // Add other fields if necessary
}

const UserPsychSchema = new Schema<IUserPsych>({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const UserPsych = model<IUserPsych>('UserPsych', UserPsychSchema);

export default UserPsych;
