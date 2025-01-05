// components/User2Chat.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './OnlineConsult.module.scss';
import backendUrl from '../../../config';
import { fetchConsultationRequests } from "../../services/consultationservice";


interface Message {
  sender: string;
  receiver: string;
  content: string;
  createdAt: string;
}

interface Consultation {
  userId: string;
  email: string;
  studentName: string;
  councelorName: string;
  date: string;
  testID: string;
  consultationType: string;
  timeForConsultation: string;
  note: string;
  status: string;
  message: string;
}


const OnlineConsult: React.FC = () => {
  const [currentConsultation, setCurrentConsultation] = useState<Consultation | null>(null);
  const { testID } = useParams<{ testID: string }>(); // Get testID from URL
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const sender = 'user2'; // Fixed as user2
  const receiver = 'user1'; // Fixed as user1

  // Fetch all consultation requests
  useEffect(() => {
    const fetchAllConsultationRequests = async () => {
      try {
        const requests = await fetchConsultationRequests();
        setCurrentConsultation(requests);

        // Find the consultation that matches the testID from the URL
        const consultation = requests.find((req: Consultation) => req.testID === testID);
        setCurrentConsultation(consultation || null);
      } catch (error) {
        console.error("Error loading consultation requests:", error);
      }
    };
    fetchAllConsultationRequests();
  }, [testID]);

  // Fetch messages between user2 and user1
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/onlineconsult/${sender}/${receiver}/${testID}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch messages', error);
      }
    };

    fetchMessages();
  }, [testID]);

  const sendMessage = async () => {
    if (message.trim() === '') return;

    try {
      const newMessage = { sender, receiver, content: message, testID };
      const response = await axios.post(`${backendUrl}/api/onlineconsult/send`, newMessage);
      setMessages([...messages, response.data]);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

   // Function to format the date in d/m/y format
   const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <div className={styles['chat-container']}>
      <div className={styles['chat-header']}
      >
        {currentConsultation ? (
          <h2>
            Chat with {currentConsultation.studentName} <br/>
            Schedule Date and Time: {formatDate(currentConsultation.date)} - {currentConsultation.timeForConsultation}
          </h2>
        ) : (
          <h2>Loading consultation details...</h2>
        )}
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
