import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from './surveyResponse.module.scss'; // Import your SCSS module for styling
import backendUrl from '../../../config';

// SurveyResponse component to display responses to a specific survey
const SurveyResponse: React.FC = () => { 
    // Extract surveyId from the URL using useParams hook
  const { surveyId } = useParams<{ surveyId: string }>(); // Extract the surveyId from the URL

    // State variables for storing survey responses and any error messages
  const [responses, setResponses] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // useEffect hook to fetch survey responses when the component mounts or surveyId changes
  useEffect(() => {
    // Ensure surveyId is available before making the request
    if (!surveyId) {
      setError('Survey ID is missing');
      return;
    }
    
    // Function to fetch survey responses from the API
    const fetchSurveyResponses = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/survey-responses?surveyId=${surveyId}`
        );
        setResponses(response.data);
      } catch (err) {
        console.error('Error fetching survey responses', err);
        setError('Failed to fetch survey responses');
      }
    };

    fetchSurveyResponses();
  }, [surveyId]); // Re-run when surveyId changes

  return (
    <div className={styles.surveyResponseContainer}>
      <h2>Survey Responses</h2>
      {responses.length === 0 ? (
        <p>No responses yet.</p>
      ) : (
        <table className={styles.responsesTable}>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Responses</th>
              <th>Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {responses.map((response) => (
              <tr key={response._id}>
                <td>{response.userId}</td>
                <td>
                  <ul>
                    {response.responses.map((item: any, index: number) => (
                      <li key={index}>
                       {item.choice}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>{new Date(response.submittedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SurveyResponse;