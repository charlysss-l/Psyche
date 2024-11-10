
import { Schema, model, Document } from 'mongoose';

export interface IUserGuidance extends Document {
  email: string;
  password: string;
}

const UserGuidanceSchema = new Schema<IUserGuidance>({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const UserGuidance = model<IUserGuidance>('UserGuidance', UserGuidanceSchema);

export default UserGuidance;
