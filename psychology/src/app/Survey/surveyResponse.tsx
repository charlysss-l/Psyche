import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from './surveyResponse.module.scss'; // Import your SCSS module for styling

const SurveyResponse: React.FC = () => {
  const { surveyId } = useParams<{ surveyId: string }>(); // Extract the surveyId from the URL
  const [responses, setResponses] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Ensure surveyId is available before making the request
    if (!surveyId) {
      setError('Survey ID is missing');
      return;
    }

    const fetchSurveyResponses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/survey-responses?surveyId=${surveyId}`
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
      {error && <p className={styles.error}>{error}</p>}
      <h2>Survey Responses</h2>
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
    </div>
  );
};

export default SurveyResponse;
