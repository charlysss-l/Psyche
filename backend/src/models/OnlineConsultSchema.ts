// models/Message.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  sender: string;
  receiver: string;
  content: string;
  testID: string; // Link message to a specific consultation
  createdAt: Date;
}

const messageSchema: Schema = new Schema(
  {
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    content: { type: String, required: true },
    testID: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;
