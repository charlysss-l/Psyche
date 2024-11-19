import React, { useState, useEffect } from 'react';
import styles from './pfresult.module.scss';  
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


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
  const navigate = useNavigate();

  // Define the factor order
  const factorOrder = ['A', 'B', 'C', 'E', 'F', 'G', 'H', 'I', 'L', 'M', 'N', 'O', 'Q1', 'Q2', 'Q3', 'Q4'];

  // Function to get factor descriptions
  const getFactorDescription = (factorLetter: string) => {
    switch (factorLetter) {
      case 'A':
        return { leftMeaning: 'Reserved, Impersonal, Distant', rightMeaning: 'Warm, Outgoing, Attentive to Others' };
      case 'B':
        return { leftMeaning: 'Concrete', rightMeaning: 'Abstract' };
      case 'C':
        return { leftMeaning: 'Reactive, Emotionally Changeable', rightMeaning: 'Emotionally Stable, Adaptive, Mature' };
      case 'E':
        return { leftMeaning: 'Deferential, Cooperative, Avoids Conflict', rightMeaning: 'Dominant, Forceful, Assertive' };
      case 'F':
        return { leftMeaning: 'Serious, Restrained, Careful', rightMeaning: 'Lively, Animated, Spontaneous' };
      case 'G':
        return { leftMeaning: 'Expedient, Nonconforming', rightMeaning: 'Rule-conscious, Dutiful' };
      case 'H':
        return { leftMeaning: 'Shy, Threat-Sensitive, Timid', rightMeaning: 'Socially Bold, Venturesome, Thick Skinned' };
      case 'I':
        return { leftMeaning: 'Utilitarian, Objective, Unsentimental', rightMeaning: 'Sensitive, Aesthetic, Sentimental' };
      case 'L':
        return { leftMeaning: 'Trusting, Unsuspecting, Accepting', rightMeaning: 'Vigilant, Suspicious, Skeptical, Wary' };
      case 'M':
        return { leftMeaning: 'Grounded, Practical, Solution-Oriented', rightMeaning: 'Abstracted, Imaginative, Idea-Oriented' };
      case 'N':
        return { leftMeaning: 'Forthright, Genuine, Artless', rightMeaning: 'Private, Discreet, Non-Disclosing' };
      case 'O':
        return { leftMeaning: 'Self-Assured, Unworried, Complacent', rightMeaning: 'Apprehensive, Self-Doubting, Worried' };
      case 'Q1':
        return { leftMeaning: 'Traditional, Attached to Familiar', rightMeaning: 'Open to Change, Experimenting' };
      case 'Q2':
        return { leftMeaning: 'Group-Oriented, Affiliative', rightMeaning: 'Self-reliant, Solitary, Individualistic' };
      case 'Q3':
        return { leftMeaning: 'Tolerates Disorder, Unexciting, Flexible', rightMeaning: 'Perfectionistic, Organized, Self-Disciplined' };
      case 'Q4':
        return { leftMeaning: 'Relaxed, Placid, Patient', rightMeaning: 'Tense, High Energy, Impatient, Driven' };
      default:
        return { leftMeaning: '', rightMeaning: '' };
    }
  };

  // Fetch data function
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user16pf');
      
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Fetched Data:', data);
      setResults(data.data); // Update results to use the correct data field
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false); // Stop loading when done
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (userID: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/user16pf/${userID}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Error deleting the test: ${response.statusText}`);
      }

      setResults(results.filter((result) => result.userID !== userID)); // Remove deleted user
      navigate('/pfresults_list');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error deleting test:', err);
    }
  };

  // Conditional rendering based on loading or error
  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.errorMessage}>Error: {error}</div>;

  const totalPages = Math.ceil(results.length / resultsPerPage);
  const currentResults = results.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);

  // Prepare data for the stacked bar chart
  const chartData = {
    labels: factorOrder,
    datasets: [
      {
        label: 'Left Meaning',
        data: factorOrder.map((factorLetter) => {
          // Count how many users have left meaning for this factor
          const countLeftMeaning = results.filter((result) => {
            const score = result.scoring.scores.find(score => score.factorLetter === factorLetter);
            const { leftMeaning } = getFactorDescription(factorLetter);
            return score && leftMeaning && score.stenScore <= 3; // Sten score between 1 and 3 for left meaning
          }).length;
          return countLeftMeaning;
        }),
        backgroundColor: 'green',
      },
      {
        label: 'Average',
        data: factorOrder.map((factorLetter) => {
          // Count how many users have average score for this factor
          const countAverage = results.filter((result) => {
            const score = result.scoring.scores.find(score => score.factorLetter === factorLetter);
            const { leftMeaning, rightMeaning } = getFactorDescription(factorLetter);
            const stenScore = score?.stenScore || 0;
            return stenScore >= 4 && stenScore <= 7; // Sten score between 4 and 7 for average range
          }).length;
          return countAverage;
        }),
        backgroundColor: 'gray',
      },
      {
        label: 'Right Meaning',
        data: factorOrder.map((factorLetter) => {
          // Count how many users have right meaning for this factor
          const countRightMeaning = results.filter((result) => {
            const score = result.scoring.scores.find(score => score.factorLetter === factorLetter);
            const { rightMeaning } = getFactorDescription(factorLetter);
            return score && rightMeaning && score.stenScore >= 8; // Sten score between 8 and 10 for right meaning
          }).length;
          return countRightMeaning;
        }),
        backgroundColor: 'red',
      },
    ],
  };
  

  return (
    <div>
      <h2>PF Results List</h2>
      <div className={styles.barContainerPF}>
        <Bar className = {styles.tablegraph} data={chartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Factor Interpretations' } } }} />
      </div>
     
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
                <th>Year & Section</th>
                <th>Test Type</th>
                <th>Responses</th>
                <th>Scores</th>
                <th>Actions</th>
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
                  <td>{result.year} - {result.section}</td>
                  <td>{result.testType}</td>
                  <td>
                  <div className={styles.responsesWrapper}>

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

                  </div>
                  </td>
                  <td>
                  <div className={styles.responsesWrapper}>

                    <table className={styles.scoresTable}>
                      <thead>
                        <tr>
                          <th>Factor Letter</th>
                          <th>Raw Score</th>
                          <th>Sten Score</th>
                          <th>Results Interpretation</th>
                        </tr>
                      </thead>
                      <tbody>
                      {factorOrder.map((factorLetter) => {
                        const score = result.scoring.scores.find(score => score.factorLetter === factorLetter);
                        if (score) {
                          const { leftMeaning, rightMeaning } = getFactorDescription(factorLetter);
                          const stenScore = score.stenScore;

                          let interpretation: React.ReactNode = ""; // Initialize as an empty string

                          if (stenScore >= 1 && stenScore <= 3) {
                            interpretation = <span className={styles.leftMeaning}>{leftMeaning}</span>;
                          } else if (stenScore >= 4 && stenScore <= 7) {
                            interpretation = (
                              <>
                                <span className={styles.leftMeaning}>{leftMeaning}</span>
                                <span className={styles.average}> (Average) </span>
                                <span className={styles.rightMeaning}>{rightMeaning}</span>
                              </>
                            );
                          } else if (stenScore >= 8 && stenScore <= 10) {
                            interpretation = <span className={styles.rightMeaning}>{rightMeaning}</span>;
                          }

                          return (
                            <tr key={factorLetter}>
                              <td>{score.factorLetter}</td>
                              <td>{score.rawScore}</td>
                              <td>{score.stenScore}</td>
                              <td>{interpretation}</td> {/* Updated to render interpretation */}
                            </tr>
                          );
                        }
                        return null;
                      })}
                    </tbody>

                    </table>

                  </div>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(result.userID)} className={styles.deleteButton}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div>
            <button
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>{currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <p>No results available.</p>
      )}
    </div>
  );
};

export default PFResultsList;
