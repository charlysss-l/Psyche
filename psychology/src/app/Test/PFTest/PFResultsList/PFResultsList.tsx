import React, { useState, useEffect } from 'react';
import styles from './page.module.scss';  // Import the CSS module

// Define the interface for the user results
interface User16PFTest {
  userID: string;
  firstName: string;
  lastName: string;
  age: string;
  sex: 'Female' | 'Male'| '';
  course: string;
  year: number;
  section: number;
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
  testType: 'Online' | 'Physical'| '';
}

const PFResultsList: React.FC = () => {
  const [results, setResults] = useState<User16PFTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 8;

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

  // Calculate the total number of pages
  const totalPages = Math.ceil(results.length / resultsPerPage);

  // Slice results based on the current page
  const currentResults = results.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  return (
    <div>
      <h2>PF Results List</h2>
      {results.length > 0 ? (
        <div>
          <table className={styles.resultsTable}>
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
                <th>Responses</th>
                <th>Scores</th>
              </tr>
            </thead>
            <tbody>
              {currentResults.map((result) => (
                <tr key={result.userID} className={styles.eachResultPF}>
                  <td>{result.userID}</td>
                  <td>{result.firstName} {result.lastName}</td>
                  <td>{result.age}</td>
                  <td>{result.sex}</td>
                  <td>{result.course}</td>
                  <td>{result.year}</td>
                  <td>{result.section}</td>
                  <td>{result.testType}</td>
                  <td>
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

export default PFResultsList;
