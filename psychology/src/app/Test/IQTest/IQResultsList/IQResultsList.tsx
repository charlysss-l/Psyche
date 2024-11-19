import React, { useState, useEffect } from 'react';
import styles from './page.module.scss'; // Import your CSS module
import { useNavigate } from 'react-router-dom';

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 8;
  const navigate = useNavigate();

  // Fetch data from the server
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/useriq');
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

      // Add interpretation to each result
      const resultsWithInterpretation = data.data.map((result: UserIQTest) => {
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

  // Handler for navigating to /iqinterpretation
  const handleNavigateToInterpretation = () => {
    navigate('/iqinterpretation');
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

  // Prepare chart data for bar chart
  const interpretationCounts: Record<string, number> = {};
  results.forEach((result) => {
    const interpretation = result.interpretation?.resultInterpretation ?? 'No interpretation available';
    interpretationCounts[interpretation] = (interpretationCounts[interpretation] || 0) + 1;
  });

  const chartData = {
    labels: Object.keys(interpretationCounts), // Categories of resultInterpretation
    datasets: [
      {
        label: 'Test Scores Based on Interpretation',
        data: Object.values(interpretationCounts), // Store corresponding counts of results for each interpretation
        backgroundColor: '#42a5f5', // Customize the color of the bars
      },
    ],
  };

  return (
    <div>
      <h2>IQ Results List</h2>
      <div className={styles.chartContainer}>
        <Bar className={styles.tablegraph} data={chartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Factor Interpretations' } } }} />
      
        </div>


      
      {/* Button to navigate to IQ Interpretation */}
      <button 
        onClick={handleNavigateToInterpretation} 
        className={styles.navigationButton} // Optional styling
      >
        Edit IQ Interpretation
      </button>

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
                <th>Responses</th>
                <th>Total Score</th>
                <th>Interpretation</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentResults.map((result) => (
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
                      <li>Percentile: {result.interpretation?.percentilePoints ?? 'N/A'}</li>
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
        <div>No results found.</div>
      )}
    </div>
  );
};

export default IQResultsList;
