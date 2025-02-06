import { Schema, model, Document } from 'mongoose';

export interface IUserGuidance extends Document {
  email: string;
  fullName: string;
  password: string;
  role: string;
  userId: string;
  firstTimeLogin: boolean;
}

const UserGuidanceSchema = new Schema<IUserGuidance>({
  email: { type: String, required: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  userId: { type: String, required: true, unique: true, length: 8 },
  firstTimeLogin: { type: Boolean, required: true, default: true },

});

const UserGuidance = model<IUserGuidance>('UserGuidance', UserGuidanceSchema);

export default UserGuidance;