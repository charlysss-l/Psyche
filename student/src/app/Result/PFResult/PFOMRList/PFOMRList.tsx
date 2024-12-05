import React, { useState, useEffect } from 'react';
import styles from './PFOMRList.module.scss';  
import { useNavigate } from 'react-router-dom';
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

// Define structure for a single score entry
export interface ScoreEntry {
  factorLetter: string;
  rawScore: number;
  stenScore: number;
}

// Update the Scoring schema to hold an array of score entries
export interface Scoring {
  scores: ScoreEntry[]; 
}

// UserIQTest interface
interface OMRpf  {
  userID: string;
  firstName: string;
  lastName: string;
  age: number;  // Changed from string to number
  sex: string;
  course: string;
  year: number;
  section: string;
  testID: string;
  scoring: Scoring[]; // Store an array of factorLetter and rawScore pairs
  testType: string;
  testDate: Date;
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


const PFOMRList: React.FC = () => {
  const [results, setResults] = useState<OMRpf[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [userID, setUserID] = useState<string | null>(null);
  const [editingTestID, setEditingTestID] = useState<string | null>(null); // Track the testID of the item being edited
  const [updatedData, setUpdatedData] = useState<Partial<OMRpf>>({}); // Store updated data for the current test

  const resultsPerPage = 8;
  const navigate = useNavigate();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedUser, setSelectedUser] = useState<OMRpf | null>(null);
  

  // Define the factor order
  const factorOrder = ['A', 'B', 'C', 'E', 'F', 'G', 'H', 'I', 'L', 'M', 'N', 'O', 'Q1', 'Q2', 'Q3', 'Q4'];

  const sortedScoring = (scoring: Scoring[] | Scoring) => {
    // Ensure scoring is an array. If it's a single object, convert it to an array.
    const scoresArray = Array.isArray(scoring)
      ? scoring.flatMap((scoringItem) => scoringItem.scores)  // Use flatMap if it's an array
      : scoring.scores;  // If it's a single object, just access its scores directly
  
    // Sort the scores based on the factorOrder
    return scoresArray.sort((a, b) => {
      const indexA = factorOrder.indexOf(a.factorLetter);
      const indexB = factorOrder.indexOf(b.factorLetter);
      return indexA - indexB;
    });
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
      const response = await fetch(`http://localhost:5000/api/omr16pf/${userID}`);
      
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
    if (userID) {
      fetchData();
    }
  }, [userID]);

  const handleEditClick = (testID: string) => {
    setEditingTestID(testID);
    const testToEdit = results.find(result => result.testID === testID);
    if (testToEdit) {
      setUpdatedData({
        age: testToEdit.age,
        sex: testToEdit.sex,
        course: testToEdit.course,
        year: testToEdit.year,
        section: testToEdit.section,
        firstName: testToEdit.firstName,  // Add firstName to editable state
        lastName: testToEdit.lastName,    // Add lastName to editable state
      });
    }
  };



  const handleDelete = async (testID: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this test?");
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`http://localhost:5000/api/omr16pf/test/${testID}`, {
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

  const handleUpdate = async (testID: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/omr16pf/test/${testID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(`Error updating the test: ${response.statusText}`);
      }

      const updatedResult = await response.json();
      setResults(prevResults =>
        prevResults.map(result =>
          result.testID === testID ? { ...result, ...updatedResult.data } : result
        )
      );
      setEditingTestID(null); // Reset the editing state

      // Reload the page after successful update
    window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error updating test:', err);
    }
  };

  // Conditional rendering based on loading or error
  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.errorMessage}>Error: {error}</div>;

  const totalPages = Math.ceil(results.length / resultsPerPage);
  const currentResults = results.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);

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
                return 'rgba(128, 128, 128, 1)'; 
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
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2>PF Results List</h2>
     
      {results.length > 0 ? (
        <div>
          <table className={styles.resultsTable}>
            <thead>
              <tr>
              <th>userID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Age</th>
                <th>Sex</th>
                <th>Course</th>
                <th>Year&#8203;</th>
                <th>Section</th>
                <th>Test Type</th>
                <th>Test ID</th>
                <th>Test Date</th>
                <th>Scores</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentResults.map((result) => (
                <tr key={result.testID} className={styles.eachResultIQ}>
                <td>{result.userID}</td>
                <td>
                  {editingTestID === result.testID ? (
                    <input
                      type="text"
                      value={updatedData.firstName}
                      onChange={(e) => setUpdatedData({ ...updatedData, firstName: e.target.value })}
                    />
                  ) : (
                    result.firstName
                  )}
                </td>
                <td>
                  {editingTestID === result.testID ? (
                    <input
                      type="text"
                      value={updatedData.lastName}
                      onChange={(e) => setUpdatedData({ ...updatedData, lastName: e.target.value })}
                    />
                  ) : (
                    result.lastName
                  )}
                </td>
                <td>
                  {editingTestID === result.testID ? (
                    <input
                      type="number"
                      value={updatedData.age}
                      onChange={(e) => setUpdatedData({ ...updatedData, age: Number(e.target.value) })}
                    />
                  ) : (
                    result.age
                  )}
                </td>
                <td>
                  {editingTestID === result.testID ? (
                    <select
                      value={updatedData.sex}
                      onChange={(e) => setUpdatedData({ ...updatedData, sex: e.target.value as 'Female' | 'Male' })}
                    >
                      <option value="" disabled>Select</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </select>
                  ) : (
                    result.sex
                  )}
                </td>
                <td>
                  {editingTestID === result.testID ? (
                    <select
                      value={updatedData.course}
                      onChange={(e) => setUpdatedData({ ...updatedData, course: e.target.value })}
                    >
                      <option value="" disabled>Select</option>
                      <option value="BSEduc">Bachelor of Secondary Education</option>
                <option value="BSBM">BS Business Management</option>
                <option value="BSCS">BS Computer Science</option>
                <option value="BSCrim">BS Criminology</option>
                <option value="BSHM">BS Hospitality Management</option>                    
                <option value="BSIT">BS Information Technology</option>
                <option value="BSP">BS Psychology</option>
                    </select>
                  ) : (
                    result.course
                  )}
                </td>
                <td>
                  {editingTestID === result.testID ? (
                    <select
                      value={updatedData.year}
                      onChange={(e) => setUpdatedData({ ...updatedData, year: Number(e.target.value) })}
                    >
                      <option value="" disabled>Select</option>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                    </select>
                  ) : (
                    result.year
                  )}
                </td>
                <td>
                  {editingTestID === result.testID ? (
                    <select
                      value={updatedData.section}
                      onChange={(e) => setUpdatedData({ ...updatedData, section: e.target.value })}
                    >
                      <option value="" disabled>Select</option>
                      <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="Irregular">Irregular</option>
                      
                    </select>
                  ) : (
                    result.section
                  )}
                </td>
                  <td>{result.testType}</td>
                  <td>{result.testID}</td>
                  <td>{new Date(result.testDate).toLocaleDateString()}</td>

                  
                  <td>
                  <div className={styles.responsesWrapper}>

                    <table className={styles.scoresTable}>
                      <thead>
                        <tr>
                          <th>Factors</th>
                    
                          <th>Results Interpretation</th>
                        </tr>
                      </thead>
                      <tbody>
  {sortedScoring(result.scoring).map((score) => {
    if (score) {
      const { leftMeaning, rightMeaning } = getFactorDescription(score.factorLetter);
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
        <tr key={score.factorLetter}>
          <td>{factorDescriptions[score.factorLetter]}</td>
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
                    <button
                      className={styles.deleteButtonIQLIST}
                      onClick={() => handleDelete(result.testID)}
                    >
                      Delete
                    </button>
                    <button 
                className={styles.graphButton} 
                onClick={() => { 
                  setSelectedUser(result); 
                  setIsModalOpen(true); 
                }}>
                Graph
              </button>
                    <button
                      className={styles.updateButtonIQLIST}
                      onClick={() => handleEditClick(result.testID)}
                    >
                      Edit
                    </button>
                    {editingTestID === result.testID && (
                      <button
                        className={styles.saveButtonIQLIST}
                        onClick={() => handleUpdate(result.testID)}
                      >
                        Save
                      </button>
                    )}
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

export default PFOMRList;
