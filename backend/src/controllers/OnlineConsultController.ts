// controllers/OnlineConsultController.ts
import { Request, Response } from 'express';
import Message from '../models/OnlineConsultSchema';

// Send a new message
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { sender, receiver, content, testID } = req.body; // Include testID
    const newMessage = new Message({ sender, receiver, content, testID });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message', error });
  }
};

// Get messages by testID
export const getMessages = async (req: Request, res: Response) => {
  try {
    const { sender, receiver, testID } = req.params; // Include testID
    const messages = await Message.find({
      testID, // Filter by testID
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages', error });
  }
};
