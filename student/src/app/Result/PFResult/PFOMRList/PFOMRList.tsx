import React, { useState, useEffect } from 'react';
import styles from './PFOMRList.module.scss';  
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
  uploadURL: string;
  isArchived: boolean;
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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [userID, setUserID] = useState<string | null>(null);
  const [editingTestID, setEditingTestID] = useState<string | null>(null); // Track the testID of the item being edited
  const [updatedData, setUpdatedData] = useState<Partial<OMRpf>>({}); // Store updated data for the current test
  const resultsPerPage = 5;
  // graph modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<OMRpf | null>(null);
  // image modal
  const [isModalOpenImage, setIsModalOpenImage] = useState(false); // State to control modal visibility
  const [modalImageURL, setModalImageURL] = useState<string | null>(null); // State for modal image URL

  

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
      const response = await fetch(`${backendUrl}/api/omr16pf/${userID}`);
      
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

  const handleViewImage = (uploadURL: string) => {
    setModalImageURL(uploadURL);
    setIsModalOpenImage(true); // Open modal when image view button is clicked
  };

  const closeModal = () => {
    setIsModalOpenImage(false); // Close modal
    setModalImageURL(null);
  };

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

  const handleRemove = async (testID: string) => {
    const confirmRemove = window.confirm("Are you sure you want to delete this test?");
    if (!confirmRemove) return;

  try {
      console.log(`Archiving test with ID: ${testID}`);  // Log to ensure the correct testID

      // Use the testID in the API request
      const response = await fetch(`${backendUrl}/api/omr16pf/archive/${testID}`, {
          method: 'PUT', // Use PUT to match backend
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Error archiving the test: ${errorData.message || response.statusText}`);
      }

      // Update the UI state to reflect the archived status
      setResults(results.filter((result) => result.testID !== testID)); // Ensure you filter by testID
      alert('Test deleted successfully.');
  } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error archiving test:', err);
  }
};

  const handleUpdate = async (testID: string) => {
    try {
      const response = await fetch(`${backendUrl}/api/omr16pf/test/${testID}`, {
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

  const filteredUsers = results
  .filter(result => !result.isArchived) // Exclude archived results
  .filter((result) => {
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

  function formatTestID(testID: string): string {
    const [userID, timestamp] = testID.split('-');
  
    if (!timestamp || isNaN(Number(timestamp))) return testID; // fallback for unexpected formats
  
    const date = new Date(Number(timestamp));
  
    const pad = (n: number) => n.toString().padStart(2, '0');
  
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
  
    const formattedDate = `${year}${month}${day}-${hours}${minutes}${seconds}`;
  
    return `${userID}-${formattedDate}`;
  }
  
  
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
          <button className={styles.closeButton}onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2 className={styles.title}>16PF Results List (Physical)
      
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
        <div className={styles.tableWrapper}>
          <table className={styles.resultsTable}>
            <thead>
              <tr>
              <th>userID</th>
              
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
               
               
                  <td>{formatTestID(result.testID)}</td>
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
                      className={styles.viewImageButton}
                      onClick={() => handleViewImage(result.uploadURL)}
                    >
                      View Image
                    </button> <br/>
                    <button
                      className={styles.deleteButtonIQLIST}
                      onClick={() => handleRemove(result.testID)}
                    >
                      Delete
                    </button>
                    <br/>
                    <button 
                className={styles.graphButton} 
                onClick={() => { 
                  setSelectedUser(result); 
                  setIsModalOpen(true); 
                }}>
                Graph
              </button> <br/>
                    {/* <button
                      className={styles.updateButtonIQLIST}
                      onClick={() => handleEditClick(result.testID)}
                    >
                      Edit
                    </button> */}
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

          {/* Modal for displaying image */}
          {isModalOpenImage && modalImageURL && (
            <div className={styles.modalImageView}>
              <div className={styles.modalContentImage}>
                <button className={styles.closeButtonImage} onClick={closeModal}>
                  X
                </button>
                <img src={modalImageURL} alt="Uploaded Image" className={styles.modalImage} />
              </div>
            </div>
          )}

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
