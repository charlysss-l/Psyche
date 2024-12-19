import { Schema, model, Document } from 'mongoose';

export interface IContent extends Document {
  key: string; // unique key for each content type
  title: string;
  text: string;
}

const ContentSchema = new Schema<IContent>({
  key: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
});

export const Content = model<IContent>('Content', ContentSchema);
