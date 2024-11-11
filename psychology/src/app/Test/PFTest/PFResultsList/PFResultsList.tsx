import React, { useState, useEffect } from 'react';
import styles from './page.module.scss';  // Import the CSS module

// Define the interface for the user results
interface User16PFTest {
  userID: string;
  firstName: string;
  lastName: string;
  age: string;
  sex: 'Female' | 'Male';
  courseSection: string;
  responses: {
    questionID: string;
    selectedChoice: 'a' | 'b' | 'c';
    equivalentScore: number;
    factorLetter: string;
  }[];
  scoring: {
    scores: {
      factorLetter: string;
      rawScore: number;
      stenScore: number;
    }[];
  };
  testType: 'Online' | 'Physical';
}

const PFResultsList: React.FC = () => {
  const [results, setResults] = useState<User16PFTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data function
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user16pf');
      
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Fetched Data:', data);
      
      // Update results to use the correct data field
      setResults(data.data);  // Access the 'data' array in the response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);  // Stop loading when done
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Conditional rendering based on loading or error
  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.errorMessage}>Error: {error}</div>;

  // Log results state to verify data before rendering
  console.log('Results State:', results);

  return (
    <div className={styles.tableContainer}>
      <h2>PF Results List</h2>
      {results.length > 0 ? (
        <table className={styles.resultsTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Sex</th>
              <th>Course Section</th>
              <th>Test Type</th>
              <th>Responses</th>
              <th>Scores</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.userID}>
                <td>{result.firstName} {result.lastName}</td>
                <td>{result.age}</td>
                <td>{result.sex}</td>
                <td>{result.courseSection}</td>
                <td>{result.testType}</td>
                <td>
                  {/* Displaying the responses in a table */}
                  <table className={styles.responsesTable}>
                    <thead>
                      <tr>
                        <th>Question Number</th>
                        <th>Selected Choice</th>
                        <th>Equivalent Score</th>
                        <th>Factor Letter</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.responses.map((response, index) => (
                        <tr key={index}>
                          <td>{response.questionID}</td>
                          <td>{response.selectedChoice}</td>
                          <td>{response.equivalentScore}</td>
                          <td>{response.factorLetter}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
                <td>
                  {/* Displaying the scores */}
                  <table className={styles.scoresTable}>
                    <thead>
                      <tr>
                        <th>Factor Letter</th>
                        <th>Raw Score</th>
                        <th>Sten Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.scoring.scores.map((score, index) => (
                        <tr key={index}>
                          <td>{score.factorLetter}</td>
                          <td>{score.rawScore}</td>
                          <td>{score.stenScore}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

export default PFResultsList;