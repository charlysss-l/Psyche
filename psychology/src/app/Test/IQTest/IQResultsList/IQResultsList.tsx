import React, { useState, useEffect } from 'react';
import styles from './page.module.scss'; // Import your CSS module

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
  age: number;
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
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 8;

  // Fetch data from the server
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/useriq');
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();

      // Adding interpretation logic (as per student logic)
      const resultsWithInterpretation = data.data.map((result: UserIQTest) => {
        const interpretation = getInterpretation(result.age, result.totalScore);
        return { ...result, interpretation };
      });

      setResults(resultsWithInterpretation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getInterpretation = (age: number, score: number) => {
    if (age >= 20 && age <= 24 && score <= 3) {
      return { percentilePoints: 5, resultInterpretation: 'Intellectually Impaired' };
    } else if (age >= 20 && age <= 24 && score >= 4) {
      return { percentilePoints: 100, resultInterpretation: 'Intelligent' };
    } else {
      return { percentilePoints: 50, resultInterpretation: 'Average' };
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.errorMessage}>Error: {error}</div>;

  // Calculate the total number of pages
  const totalPages = Math.ceil(results.length / resultsPerPage);

  // Slice results based on the current page
  const currentResults = results.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  return (
    <div>
      <h2>IQ Results List</h2>
      {results.length > 0 ? (
        <div>
          <table className={styles.resultsTableIQ}>
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
              {currentResults.map((result) => (
                <tr key={result.userID} className={styles.eachResultIQ}>
                  <td>{result.firstName} {result.lastName}</td>
                  <td>{result.age}</td>
                  <td>{result.sex}</td>
                  <td>{result.testType}</td>
                  <td>{new Date(result.testDate).toLocaleDateString()}</td>
                  <td>
                    <table>
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
                            <td>
                              <img
                                className={styles['selected-choice-img']}
                                src={response.selectedChoice}
                                alt={`Choice ${index + 1}`}
                              />
                            </td>
                            <td>{response.isCorrect ? 'Correct' : 'Incorrect'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                  <td>{result.totalScore}</td>
                  <td>
                    <ul>
                     
                      <li>Score: {result.totalScore}</li>
                      <li>Interpretation: {result.interpretation.resultInterpretation}</li>
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className={styles.pagination}>
            <button
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default IQResultsList;
