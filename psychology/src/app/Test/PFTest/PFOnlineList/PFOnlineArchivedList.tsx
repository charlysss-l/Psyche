import React, { useState, useEffect } from 'react';
import styles from './PFOnlineArchivedList.module.scss';  
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import backendUrl from '../../../../config';

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
  testID: string;
  testDate: Date;
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

const PFOnlineArchivedList: React.FC = () => {
  const [results, setResults] = useState<User16PFTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");

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
      const response = await fetch(`${backendUrl}/api/user16pf/isTrue/archived/all`);
       
      if (response.status === 404) {
        // Handle 404 as no archived results
        setError(null);
        setResults([]);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.data.length === 0) {
        setError('No archived results yet.');
        setResults([]);
      } else {
      console.log('Fetched Data:', data);
      setResults(data.data); // Update results to use the correct data field
      setError(null);
    }
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

  
  const handleDelete = async (testID: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this result?");
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`${backendUrl}/api/user16pf/test/delete/${testID}`);
      setResults((prevConsultations) =>
        prevConsultations.filter((consultation) => consultation.testID !== testID)
      );
      alert("IQ Result deleted successfully.");
    } catch (error) {
      console.error("Error deleting IQ Result:", error);
      alert("Failed to delete IQ Result.");
    }
  };

  const handleRestore = async (testID: string) => {
    const confirmRemove = window.confirm("Are you sure you want to restore this test?");
    if (!confirmRemove) return;

  try {
      console.log(`Archiving test with ID: ${testID}`);  // Log to ensure the correct testID

      // Use the testID in the API request
      const response = await fetch(`${backendUrl}/api/user16pf/unarchive/${testID}`, {
          method: 'PUT', // Use PUT to match backend
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Error archiving the test: ${errorData.message || response.statusText}`);
      }

      // Update the UI state to reflect the archived status
      alert('Test restored successfully.');
      window.location.reload()
  } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error archiving test:', err);
  }
};

const filteredUsers = results.filter((result) => {
  const normalizedDate = normalizeDate(result.testDate); // Normalize the date for comparison
  const normalizedSearchTerm = normalizeSearchTerm(searchTerm); // Normalize the search term
  return [
    result.userID,
    result.firstName,
    result.lastName,
    result.sex,
    result.course,
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


  return (
    <div className={styles.floatingContainer}>
      <h2>PF Results List (Online)
      <p className={styles.resultCount}>
  Total Archived Results: {filteredUsers.length}
</p>
      <input
        type="text"
        placeholder="Search by User ID, Name, Sex, Course, Date"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />
      </h2>
     
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
                <th>Responses</th>
                <th>Scores</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentResults.map((result) => (
                <tr  className={styles.eachResultPF}>
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
                          <th>Factors</th>
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
                      className={styles.restoreButtonPfLIST} 
                      onClick={() => handleRestore(result.testID)}
                    >
                      Restore
                    </button>
                    <br/>
                    <button className={styles.deleteButton} onClick={() => handleDelete(result.testID)}>
                      Delete
                    </button></td>
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
        <p>No Archived PF results Yet.</p>
      )}
    </div>
  );
};

export default PFOnlineArchivedList;
