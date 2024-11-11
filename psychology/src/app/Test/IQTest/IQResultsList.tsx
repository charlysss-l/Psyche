import React, { useState, useEffect } from 'react';
import styles from './page.module.scss'; // Import your CSS module

// Define the interface for the IQ test result
interface Response {
  questionID: string;
  selectedChoice: string;
  isCorrect: boolean;
}

interface Interpretation {
  ageRange: string;
  sex: 'Female' | 'Male';
  minTestScore: number;
  maxTestScore: number;
  percentilePoints: number;
  resultInterpretation: string;
}

interface UserIQTest {
  userID: string;
  firstName: string;
  lastName: string;
  age: string;
  sex: 'Female' | 'Male';
  testID: string;
  responses: Response[];
  totalScore: number;
  interpretation: Interpretation;
  testType: 'Online' | 'Physical';
  testDate: Date;
}

const IQResultsList: React.FC = () => {
  const [results, setResults] = useState<UserIQTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from the server
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/useriq');
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      setResults(data.data);  // Assuming the data is inside a `data` field
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.errorMessage}>Error: {error}</div>;

  return (
    <div className={styles.tableContainer}>
      <h2>IQ Results List</h2>
      {results.length > 0 ? (
        <table className={styles.resultsTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Sex</th>
              <th>Test Type</th>
              <th>Test Date</th>
              <th>Responses</th>
              <th>Total Score</th>
              <th>Interpretation</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.userID}>
                <td>{result.firstName} {result.lastName}</td>
                <td>{result.age}</td>
                <td>{result.sex}</td>
                <td>{result.testType}</td>
                <td>{new Date(result.testDate).toLocaleDateString()}</td>
                <td>
                  <table className={styles.responsesTable}>
                    <thead>
                      <tr>
                        <th>Question ID</th>
                        <th>Selected Choice</th>
                        <th>Correct</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.responses.map((response, index) => (
                        <tr key={index}>
                          <td>{response.questionID}</td>
                          <td>{response.selectedChoice}</td>
                          <td>{response.isCorrect ? 'Correct' : 'Incorrect'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
                <td>{result.totalScore}</td>
                <td>
                  <ul>
                    <li>Age Range: {result.interpretation.ageRange}</li>
                    <li>Sex: {result.interpretation.sex}</li>
                    <li>Score: {result.totalScore}</li>
                    <li>Interpretation: {result.interpretation.resultInterpretation}</li>
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default IQResultsList;
