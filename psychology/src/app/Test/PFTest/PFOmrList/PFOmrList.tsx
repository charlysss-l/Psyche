import React, { useState, useEffect } from 'react';
import styles from './PFOmrList.module.scss';  
import { useNavigate } from 'react-router-dom';
import PFOmrArchivedList from './PFOmrArchivedList';
import * as XLSX from 'xlsx';


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
  section: number;
  testID: string;
  scoring: Scoring[]; // Store an array of factorLetter and rawScore pairs
  testType: string;
  testDate: Date;
  isArchived: boolean;
  uploadURL: string;
}

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


const PFOmrList: React.FC = () => {
  const [results, setResults] = useState<OMRpf[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [userID, setUserID] = useState<string | null>(null);
  const [editingTestID, setEditingTestID] = useState<string | null>(null); // Track the testID of the item being edited
  const [updatedData, setUpdatedData] = useState<Partial<OMRpf>>({}); // Store updated data for the current test
  const resultsPerPage = 5;
  const navigate = useNavigate();
  const [isArchivedListVisible, setIsArchivedListVisible] = useState(false);
  const toggleArchivedList = () => {
    setIsArchivedListVisible(!isArchivedListVisible);
  };
  // image modal
const [isModalOpenImage, setIsModalOpenImage] = useState(false); // State to control modal visibility
const [modalImageURL, setModalImageURL] = useState<string | null>(null); // State for modal image URL

  


  

  // Define the factor order
  const factorOrder = ['A', 'B', 'C', 'E', 'F', 'G', 'H', 'I', 'L', 'M', 'N', 'O', 'Q1', 'Q2', 'Q3', 'Q4'];

  // Function to sort the scoring based on the factor order
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
      const response = await fetch(`http://localhost:5000/api/omr16pf`);
      
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Fetched Data:', data);

      // Filter out archived results
    const filteredResults = data.data.filter((result: OMRpf) => !result.isArchived);
    setResults(filteredResults); // Update results to show only non-archived results
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


  const handleArchive = async (testID: string) => {
    try {
        console.log(`Archiving test with ID: ${testID}`);  // Log to ensure the correct testID

        // Use the testID in the API request
        const response = await fetch(`http://localhost:5000/api/omr16pf/archive/${testID}`, {
            method: 'PUT', // Use PUT to match backend
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error archiving the test: ${errorData.message || response.statusText}`);
        }

        // Update the UI state to reflect the archived status
        setResults(results.filter((result) => result.testID !== testID)); // Ensure you filter by testID
        alert('Test archived successfully.');
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error archiving test:', err);
    }
};

  

  // Conditional rendering based on loading or error
  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.errorMessage}>Error: {error}</div>;

  const totalPages = Math.ceil(results.length / resultsPerPage);
  const currentResults = results.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);

  // export as excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(results.map((result) => ({
      userID: result.userID,
      name: `${result.firstName} ${result.lastName}`,
      age: result.age,
      sex: result.sex,
      course: result.course,
      yearAndSection: `${result.year} - ${result.section}`,
      testType: result.testType,
      testDate: result.testDate,
      scores: sortedScoring(result.scoring).map(score => {
        const { leftMeaning, rightMeaning } = getFactorDescription(score.factorLetter);
        const stenScore = score.stenScore;
  
        let interpretation = "";
  
        if (stenScore >= 1 && stenScore <= 3) {
          interpretation = leftMeaning;
        } else if (stenScore >= 4 && stenScore <= 7) {
          interpretation = `(Average) (Left Meaning: ${leftMeaning}, Right Meaning: ${rightMeaning})`;
        } else if (stenScore >= 8 && stenScore <= 10) {
          interpretation = rightMeaning;
        }
  
        return `(Factor: ${factorDescriptions[score.factorLetter]}) (Raw: ${score.rawScore}, Sten: ${score.stenScore}, Interpretation: ${interpretation})`;
      }).join(', '),
    })));
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'PF Results');
    
    // Generate Excel file and prompt user to download
    XLSX.writeFile(workbook, 'PFResults (Pyhsical).xlsx');
  };

  return (
    <div>
      <h2 className={styles.title}>PF Results List ((Physical))

      <div className={styles.buttonsWrapper}>
    <button onClick={exportToExcel} className={styles.exportButton}>
      Export to Excel
    </button>
    <button
      className={isArchivedListVisible ? styles.closeButton : styles.archiveButton}
      onClick={toggleArchivedList}
    >
      {isArchivedListVisible ? 'Close' : 'Archive List'}
    </button>
  </div>
</h2>

<p className={styles.resultCount}>
  Total Results: {results.length}
</p>

  {isArchivedListVisible && <PFOmrArchivedList />}

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
                <th>Year&#8203;</th>
                <th>Section</th>
                <th>Test Type</th>
                <th>Test Date</th>
                <th>Scores</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentResults.map((result) => (
                <tr  className={styles.eachResultIQ}>
                <td>{result.userID}</td>
                <td>{result.firstName} {result.lastName}</td>
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
                      <option value="BSCS">BSCS</option>
                      <option value="BSIT">BSIT</option>
                      <option value="BSBA">BSBA</option>
                      <option value="BSECE">BSECE</option>
                      <option value="BSCE">BSCE</option>
                      <option value="BSED">BSED</option>
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
                      onChange={(e) => setUpdatedData({ ...updatedData, section: Number(e.target.value) })}
                    >
                      <option value="" disabled>Select</option>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                      <option value={6}>6</option>
                      <option value={7}>7</option>
                      <option value={8}>8</option>
                      <option value={9}>9</option>
                      
                    </select>
                  ) : (
                    result.section
                  )}
                </td>
                  <td>{result.testType}</td>
                  <td>{new Date(result.testDate).toLocaleDateString()}</td>

                  
                  <td>
                  <div className={styles.responsesWrapper}>

                    <table className={styles.scoresTable}>
                      <thead>
                        <tr>
                          <th>Factors</th>
                          <th>Raw Score</th>
                          <th>Sten Score</th>
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
                    <button
                      className={styles.viewImageButton}
                      onClick={() => handleViewImage(result.uploadURL)}
                    >
                      View Image
                    </button>
                    <button className={styles.archiveButtons} onClick={() => handleArchive(result.testID)}>
                      Archive
                    </button>
                    
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
    </div>
  );
};

export default PFOmrList;
