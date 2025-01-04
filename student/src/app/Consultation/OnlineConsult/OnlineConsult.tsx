// components/Chat.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './OnlineConsult.module.scss'; // Import the SCSS module
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
  const [sender, setSender] = useState('user1');  // Initially set to user1
  const [receiver, setReceiver] = useState('user2');  // Initially set to user2
  const [user, setUser] = useState('user1');  // Track the logged-in user

  // Fetch messages between sender and receiver
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
  }, [sender, receiver]);

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

  // Toggle between user1 and user2
  const toggleUser = () => {
    if (user === 'user1') {
      setUser('user2');
      setSender('user2');
      setReceiver('user1');
    } else {
      setUser('user1');
      setSender('user1');
      setReceiver('user2');
    }
  };

  return (
    <div className={styles['chat-container']}>
      <div className={styles['chat-header']}>
        <h2>Chat with {receiver}</h2>
        <button onClick={toggleUser}>
          Switch to {user === 'user1' ? 'User 2' : 'User 1'}
        </button>
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
