import React, { useState, useEffect } from 'react';
import styles from './PFOnlineList.module.scss';  
import backendUrl from '../../../../config';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';





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
  testID: string;
  testDate: Date;
  testType: 'Online' | 'Physical'| '';
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const factorDescriptions: Record<string, string> = {
  A: 'Warmth',
  B: 'Reasoning',
  C: 'Emotional Stability',
  E: 'Dominance',
  F: 'Liveliness',
  G: 'Rule-Consciousness',
  H: 'Social Boldness',
  I: 'Sensitivity',
  L: 'Vigilance',
  M: 'Abstractedness',
  N: 'Privateness',
  O: 'Apprehension',
  Q1: 'Openness to Change',
  Q2: 'Self-Reliance',
  Q3: 'Perfectionism',
  Q4: 'Tension',
};

const PFOnlineList: React.FC = () => {
  const [results, setResults] = useState<User16PFTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [userID, setUserID] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;
  const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedUser, setSelectedUser] = useState<User16PFTest | null>(null);

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

  // Fetch userID from localStorage and set it in state
  useEffect(() => {
    const storedUserID = localStorage.getItem('userId');
    if (storedUserID) {
      setUserID(storedUserID);
    } else {
      setError('User ID not found. Please log in again.');
    }
  }, []);

  // Fetch data function
  const fetchData = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/user16pf/user/${userID}`);
      
      

      const data = await response.json();
      console.log('Fetched Data:', data);

      // Check if data is empty and set results accordingly
      if (data.data && data.data.length > 0) {
        setResults(data.data); // Update results if there is data
      } 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false); // Stop loading when done
    }
  };

  useEffect(() => {
    if (userID) {
      fetchData();
    }
  }, [userID]);

  const handleDelete = async (testID: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this test?");
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`${backendUrl}/api/user16pf/test/${testID}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error(`Error deleting the test: ${response.statusText}`);
      }
  
      // Remove the deleted test from the state
      setResults(results.filter((result) => result.testID !== testID));
      alert("Test Result deleted successfully.");

      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error deleting test:', err);
    }
  };

  const filteredUsers = results.filter((result) => {
    const normalizedDate = normalizeDate(result.testDate); // Normalize the date for comparison
    const normalizedSearchTerm = normalizeSearchTerm(searchTerm); // Normalize the search term
    return [
      result.testID,
      normalizedDate,
    ]
    .join(" ")
    .toLowerCase()
    .includes(normalizedSearchTerm.toLowerCase());
  });
  
  // Utility function to normalize the date
  function normalizeDate(date: Date | string): string {
    if (!date) return ""; // Handle empty dates
    const parsedDate = new Date(date); // Parse the date
    if (isNaN(parsedDate.getTime())) return ""; // Check for invalid dates
    const month = parsedDate.getMonth() + 1; // Months are 0-based
    const day = parsedDate.getDate();
    const year = parsedDate.getFullYear();
    return `${month}/${day}/${year}`; // Use single digits for month/day
  }

  // Utility function to normalize the search term
function normalizeSearchTerm(term: string): string {
  return term.replace(/(^|\/)0+/g, "$1"); // Remove leading zeros from search term
}


  // Conditional rendering based on loading or error
  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.errorMessage}>Error: {error}</div>;

  const totalPages = Math.ceil(filteredUsers.length / resultsPerPage);
  const currentResults = filteredUsers.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);

  // Prepare data for the stacked bar chart


  const Modal = ({ isOpen, onClose, data }: { isOpen: boolean, onClose: () => void, data: any }) => {
    if (!isOpen || !data) return null;
  
    // List of 16 factor descriptions
    const factorDescriptions: Record<string, string> = {
      A: 'Warmth',
      B: 'Reasoning',
      C: 'Emotional Stability',
      E: 'Dominance',
      F: 'Liveliness',
      G: 'Rule-Consciousness',
      H: 'Social Boldness',
      I: 'Sensitivity',
      L: 'Vigilance',
      M: 'Abstractedness',
      N: 'Privateness',
      O: 'Apprehension',
      Q1: 'Openness to Change',
      Q2: 'Self-Reliance',
      Q3: 'Perfectionism',
      Q4: 'Tension',
    };
  
    // Assuming `factorOrder` contains all factor letters
    const factorOrder = ['A', 'B', 'C', 'E', 'F', 'G', 'H', 'I', 'L', 'M', 'N', 'O', 'Q1', 'Q2', 'Q3', 'Q4'];
  
    const chartData = {
      labels: factorOrder.map(factorLetter => factorDescriptions[factorLetter] || factorLetter), // Use factor descriptions
      datasets: [
        {
          label: '                           Low (1, 2, 3)                            Average (4, 5, 6, 7)                       High (8, 9, 10)', 
          data: factorOrder.map(factorLetter => {
            const score = data.scoring.scores.find((score: { factorLetter: string; }) => score.factorLetter === factorLetter);
            return score ? score.stenScore : 0; // Default to 0 if no score is found
          }),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'violet',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  
    const chartOptions = {
      responsive: true,
      indexAxis: 'y' as const, // Switch axes to make the chart horizontal
      plugins: {
        legend: {
          display: true,
          position: 'top' as const,
        },
        tooltip: {
          mode: 'index' as const,
          intersect: false,
        },
      },
      
      scales: {
        x: {
          title: {
            display: true,
            text: 'Score',
          },
          min: 1,
          max: 10,
          grid: {
            drawOnChartArea: true,
            color: (context: any) => {
              const xValue = context.tick.value;
              // Apply gray background color to grid lines for Sten 4-7
              if (xValue >= 4 && xValue <= 7) {
                return 'black'; 
              }
              return 'rgba(0, 0, 0, 0.1)';
            },
          },
        },
        y: {
          title: {
            display: true,
            text: 'Factors',
          },
          // Adding tick configuration to improve factor display on y-axis
          ticks: {
            autoSkip: false, // Prevent auto-skipping of labels
            maxRotation: 45, // Rotate labels for better visibility
            minRotation: 0,
          },
        },
      },
    };
  
    return (
      <div className={styles.modal} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <h2>16PF Fifth Edition Individual Record Form for {data.firstName} {data.lastName}</h2>
          <Line data={chartData} options={chartOptions} />
          <button className={styles.closebutton} onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <h2 className={styles.title}>16PF Results List (Online)
      
<div className={styles.smartWrapper}>

<input
        type="text"
        placeholder="Search by Test ID or Date"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />
      </div>
      </h2>

      <p className={styles.resultCount}>
  Total Results: {filteredUsers.length}
</p>
      
     
      {filteredUsers.length > 0 ? (
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
                <th>Test ID</th>
                <th>Test Date</th>
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
                  <td>{result.testID}</td>
                  <td>{new Date(result.testDate).toLocaleDateString()}</td>
                  <td>
                  <div className={styles.responsesWrapper}>

                    <table className={styles.responsesTable}>
                      <thead>
                        <tr>
                          <th>Question Number</th>
                          <th>Selected Choice</th>
                          
                       
                        </tr>
                      </thead>
                      <tbody>
                        {result.responses.map((response, index) => (
                          <tr key={index}>
                            <td>{response.questionID}</td>
                            <td>{response.selectedChoice}</td>
                       
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
                          <th>Factors</th>
                          
                          <th>Results Interpretations</th>
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
                                <span className={styles.average}> (Average) </span> <br/>
                                <span className={styles.leftMeaning}>{leftMeaning}</span> <br/>
                                <span className={styles.rightMeaning}>{rightMeaning}</span>
                              </>
                            );
                          } else if (stenScore >= 8 && stenScore <= 10) {
                            interpretation = <span className={styles.rightMeaning}>{rightMeaning}</span>;
                          }

                          return (
                            <tr key={factorLetter}>
                              <td>{factorDescriptions[factorLetter]}</td>
                            
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
                    <button className={styles.deleteButton} onClick={() => handleDelete(result.testID)}>Delete</button>
                    <button 
                className={styles.graphButton} 
                onClick={() => { 
                  setSelectedUser(result); 
                  setIsModalOpen(true); 
                }}>
                Graph
              </button>
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

<Modal 
  isOpen={isModalOpen} 
  onClose={() => setIsModalOpen(false)} 
  data={selectedUser} 
/>
    </div>
  );
};

export default PFOnlineList;
