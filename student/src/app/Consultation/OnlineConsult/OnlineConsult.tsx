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
  testID: string;
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
  const sender = 'user1';
  const receiver = 'user2';

      useEffect(() => {
          // Set viewport for zoom-out effect
          const metaViewport = document.querySelector('meta[name="viewport"]');
          if (metaViewport) {
            metaViewport.setAttribute("content", "width=device-width, initial-scale=0.8, maximum-scale=1.0");
          } else {
            const newMeta = document.createElement("meta");
            newMeta.name = "viewport";
            newMeta.content = "width=device-width, initial-scale=0.8, maximum-scale=1.0, user-scalable=no";
            document.head.appendChild(newMeta);
          }
      
          // Cleanup function to reset viewport when leaving the page
          return () => {
            if (metaViewport) {
              metaViewport.setAttribute("content", "width=device-width, initial-scale=1.0");
            }
          };
        }, []);

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

  // Poll for new messages every 5 seconds
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/onlineconsult/${sender}/${receiver}/${testID}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch messages', error);
      }
    };

    fetchMessages(); // Fetch messages initially
    const intervalId = setInterval(fetchMessages, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [testID]);

  const sendMessage = async () => {
    if (message.trim() === '') return;

    try {
      const newMessage = { sender, receiver, content: message, testID };
      const response = await axios.post(`${backendUrl}/api/onlineconsult/send`, newMessage);
      setMessages((prevMessages) => [...prevMessages, response.data]);
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

  // Function to check if the current date and time match the scheduled consultation time
  const isConsultationTimeActive = () => {
    if (!currentConsultation) return false;

    const scheduledDateTime = new Date(
      `${currentConsultation.date}T${currentConsultation.timeForConsultation}`
    );
    const currentTime = new Date();

    // Check if the current time is between the scheduled start and end time
    return currentTime >= scheduledDateTime;
  };

  const formatMessage = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
  };
  

  return (
    <div className={styles['chat-container']}>
      <div className={styles['chat-header']}>
        {currentConsultation ? (
          <h2>
            Chat with {currentConsultation.councelorName} <br/>
            Schedule Date and Time: {formatDate(currentConsultation.date)} - {currentConsultation.timeForConsultation} <br/>
            Note: {currentConsultation.note}
          </h2>
        ) : (
          <h2>Loading consultation details...</h2>
        )}
      </div>

      <div className={styles['chat-window']}>
        {messages.map((msg) => (
          <div key={msg.createdAt} className={`${styles.message} ${msg.sender === sender ? styles.sent : styles.received}`}>
            <p dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
          </div>
        ))}
      </div>


      <div className={styles['chat-input']}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          // disabled={!isConsultationTimeActive()}

        >
          Send
        </button>
        <p style={{ textAlign:"center" }}>Note: You can only send messages during the scheduled consultation time.</p>
      </div>
    </div>
  );
};

export default OnlineConsult;
