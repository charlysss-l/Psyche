import React, { useState, useEffect } from 'react';
import styles from './page.module.scss'; // Import your CSS module
import { useNavigate } from 'react-router-dom';

interface Response {
  questionID: string;
  selectedChoice: string;
  isCorrect: boolean;
}

interface Interpretation {
  minAge: number;
  maxAge: number;
  minTestScore: number;
  maxTestScore: number;
  percentilePoints: number;
  resultInterpretation: string;
}

interface UserIQTest {
  userID: string;
  firstName: string;
  lastName: string;
  age: number;
  sex: 'Female' | 'Male';
  course: string;
  year: number;
  section: number;
  testID: string;
  responses: Response[];
  totalScore: number;
  testType: 'Online' | 'Physical';
  testDate: Date;
  interpretation?: {
    percentilePoints: number;
    resultInterpretation: string;
  };
}

const IQResultsList: React.FC = () => {
  const [results, setResults] = useState<UserIQTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch userID from localStorage and set it in state
  useEffect(() => {
    const storedUserID = localStorage.getItem('userId');
    if (storedUserID) {
      setUserID(storedUserID);
    } else {
      setError('User ID not found. Please log in again.');
    }
  }, []);

  // Fetch data based on userID
  const fetchData = async () => {
    if (!userID) return; // Don't fetch if userID is not available

    try {
      const response = await fetch(`http://localhost:5000/api/useriq/${userID}`);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();

      // Fetch IQ test interpretation data
      const iqTestResponse = await fetch('http://localhost:5000/api/IQtest/67277ea7aacfc314004dca20');
      if (!iqTestResponse.ok) {
        throw new Error(`Failed to fetch IQ test: ${iqTestResponse.statusText}`);
      }
      const iqTestData = await iqTestResponse.json();
      const interpretations: Interpretation[] = iqTestData.interpretation;

      // Add interpretation to the user's result
      const resultWithInterpretation = data.data.map((result: UserIQTest) => {
        const interpretation = interpretations.find(
          (interp) =>
            result.age >= interp.minAge &&
            result.age <= interp.maxAge &&
            result.totalScore >= interp.minTestScore &&
            result.totalScore <= interp.maxTestScore
        );

        return {
          ...result,
          interpretation: interpretation
            ? {
                percentilePoints: interpretation.percentilePoints,
                resultInterpretation: interpretation.resultInterpretation,
              }
            : { percentilePoints: 0, resultInterpretation: 'No interpretation available' },
        };
      });

      setResults(resultWithInterpretation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userID) {
      fetchData();
    }
  }, [userID]); // Trigger fetchData when userID changes

  const handleDelete = async (userID: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/useriq/${userID}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Error deleting the test: ${response.statusText}`);
      }

      // Remove the deleted user from the state
      setResults(results.filter((result) => result.userID !== userID));
      navigate('/iqresults_list'); 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error deleting test:', err);
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.errorMessage}>Error: {error}</div>;

  return (
    <div>
      <h2>IQ Results List</h2>

      {results.length > 0 ? (
        <div>
          <table className={styles.resultsTableIQ}>
            <thead>
              <tr>
                <th>userID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Sex</th>
                <th>Course</th>
                <th>Year</th>
                <th>Section</th>
                <th>Test Type</th>
                <th>Test Date</th>
                <th>Total Score</th>
                <th>Interpretation</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {results.map((result) => (
                <tr key={result.userID} className={styles.eachResultIQ}>
                  <td>{result.userID}</td>
                  <td>{result.firstName} {result.lastName}</td>
                  <td>{result.age}</td>
                  <td>{result.sex}</td>
                  <td>{result.course}</td>
                  <td>{result.year}</td>
                  <td>{result.section}</td>
                  <td>{result.testType}</td>
                  <td>{new Date(result.testDate).toLocaleDateString()}</td>
                 
                  <td>{result.totalScore}</td>
                  <td>
                    <ul>
                      <li>Interpretation: {result.interpretation?.resultInterpretation ?? 'N/A'}</li>
                    </ul>
                  </td>
                  <td>
                    <button 
                      className={styles.deleteButtonIQLIST} 
                      onClick={() => handleDelete(result.userID)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default IQResultsList;
