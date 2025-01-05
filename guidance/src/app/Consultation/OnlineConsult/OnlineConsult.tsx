// components/User2Chat.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './OnlineConsult.module.scss';
import backendUrl from '../../../config';

interface Message {
  sender: string;
  receiver: string;
  content: string;
  createdAt: string;
}

const OnlineConsult: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const sender = 'user2'; // Fixed as user2
  const receiver = 'user1'; // Fixed as user1

  // Fetch messages between user2 and user1
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/onlineconsult/${sender}/${receiver}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch messages', error);
      }
    };

    fetchMessages();
  }, []);

  const sendMessage = async () => {
    if (message.trim() === '') return;

    try {
      const newMessage = { sender, receiver, content: message };
      const response = await axios.post(`${backendUrl}/api/onlineconsult/send`, newMessage);
      setMessages([...messages, response.data]);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  return (
    <div className={styles['chat-container']}>
      <div className={styles['chat-header']}>
        <h2>Chat with {receiver}</h2>
      </div>

      <div className={styles['chat-window']}>
        {messages.map((msg) => (
          <div key={msg.createdAt} className={`${styles.message} ${msg.sender === sender ? styles.sent : styles.received}`}>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>

      <div className={styles['chat-input']}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default OnlineConsult;
