// routes/messageRoutes.ts
import express from 'express';
import { sendMessage, getMessages } from '../controllers/OnlineConsultController';

const router = express.Router();

// Route to send a message
router.post('/send', sendMessage);

// Route to get messages between two users
router.get('/:sender/:receiver', getMessages);

export default router;
