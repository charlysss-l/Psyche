import React, { useState, useEffect } from 'react';
import styles from './PFOmrList.module.scss';  
import { useNavigate } from 'react-router-dom';
// Define the interface for the user results
interface User16PFTest {
  userID: string;
  firstName: string;
  lastName: string;
  age: number;
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
    factorLetter: string;
    rawScore: number;
    stenScore: number;
}[] | [];
  testType: 'Online' | 'Physical'| '';
}

const calculateStenScore = (rawScore: number, factorLetter: string): number => {
    // Factor-specific mappings
    switch (factorLetter) {
        case 'A':
            if (rawScore >= 0 && rawScore <= 3) {
                return 1; // Factor A custom mapping
            }else if (rawScore >= 4 && rawScore <= 5) {
                return 2; 
            } else if (rawScore >= 6 && rawScore <= 8) {
                return 3; 
            }else if (rawScore >= 9 && rawScore <= 11) {
                return 4; 
            }
            else if (rawScore >= 12 && rawScore <= 14) {
                return 5; 
            }
            else if (rawScore >= 15 && rawScore <= 17) {
                return 6; 
            }
            else if (rawScore >= 18 && rawScore <= 19) {
                return 7; 
            }
            else if (rawScore === 20) {
                return 8; 
            }
            else if (rawScore >= 21 && rawScore <= 22) {
                return 9; 
            }
            break;
        case 'B':
            if (rawScore >= 0 && rawScore <= 3) {
                return 1; 
            } else if (rawScore === 4) {
                return 2; 
            }
            else if (rawScore >=  5 && rawScore <= 6 ) {
                return 3; 
            }
            else if (rawScore >= 7 && rawScore <= 8) {
                return 4; 
            }
            else if (rawScore >= 9 && rawScore <= 10) {
                return 5; 
            }
            else if (rawScore >=  11 && rawScore <= 12) {
                return 6; 
            }
            else if (rawScore === 13 ) {
                return 7; 
            }
            else if (rawScore === 14 ) {
                return 8; 
            }
            else if (rawScore === 15 ) {
                return 9; 
            }
            break;
            case 'C':
                if (rawScore >= 0 && rawScore <= 2 ) {
                    return 1; 
                } else if (rawScore >= 3 && rawScore <= 5 ) {
                    return 2; 
                }
                else if (rawScore >= 6 && rawScore <= 8) {
                    return 3; 
                }
                else if (rawScore >= 9 && rawScore <= 12 ) {
                    return 4; 
                }
                else if (rawScore >=  13 && rawScore <= 16) {
                    return 5; 
                }
                else if (rawScore >= 17  && rawScore <= 18 ) {
                    return 6; 
                }
                else if (rawScore === 19 ) {
                    return 7; 
                }
                else if (rawScore === 20 ) {
                    return 8; 
                }
                break;
                case 'E':
                    if (rawScore >= 0 && rawScore <= 2) {
                        return 1; 
                    } else if (rawScore >= 3 && rawScore <= 5) {
                        return 2; 
                    }
                    else if (rawScore >= 6 && rawScore <= 8) {
                        return 3; 
                    }
                    else if (rawScore >=  9 && rawScore <= 11) {
                        return 4; 
                    }
                    else if (rawScore >= 12 && rawScore <= 14) {
                        return 5; 
                    }
                    else if (rawScore >=  15 && rawScore <= 17) {
                        return 6; 
                    }
                    else if (rawScore === 18 ) {
                        return 7; 
                    }
                    else if (rawScore === 19 ) {
                        return 8; 
                    }
                    else if (rawScore === 20 ) {
                        return 9; 
                    }
                break;
                case 'G':
                    if (rawScore >=  0&& rawScore <= 2) {
                        return 1; 
                    } else if (rawScore >= 3 && rawScore <= 5) {
                        return 2; 
                    }
                    else if (rawScore >= 6 && rawScore <=8 ) {
                        return 3; 
                    }
                    else if (rawScore >=  9&& rawScore <= 11) {
                        return 4; 
                    }
                    else if (rawScore >=  12&& rawScore <= 15) {
                        return 5; 
                    }
                    else if (rawScore >=  16&& rawScore <= 18 ) {
                        return 6; 
                    }
                    else if (rawScore >=  19&& rawScore <= 20) {
                        return 7; 
                    }
                    else if (rawScore === 21 ) {
                        return 8; 
                    }
                    else if (rawScore === 22 ) {
                        return 9; 
                    }
                break;
                case 'H':
                    if (rawScore >=   0&& rawScore <=1 ) {
                        return 2; 
                    } else if (rawScore >= 2 && rawScore <= 3) {
                        return 3; 
                    }
                    else if (rawScore >= 4 && rawScore <= 7) {
                        return 4; 
                    }
                    else if (rawScore >=  8&& rawScore <=12 ) {
                        return 5; 
                    }
                    else if (rawScore >= 13 && rawScore <= 16) {
                        return 6; 
                    }
                    else if (rawScore >=  17&& rawScore <= 18) {
                        return 7; 
                    }
                    else if (rawScore === 19) {
                        return 8; 
                    }
                    else if (rawScore=== 20 ) {
                        return 9; 
                    }
                break;
                case 'I':
                    if (rawScore === 0 ) {
                        return 1; 
                    } else if (rawScore >= 1 && rawScore <=2 ) {
                        return 2; 
                    }
                    else if (rawScore >=  3&& rawScore <= 5) {
                        return 3; 
                    }
                    else if (rawScore >=  6&& rawScore <=8 ) {
                        return 4; 
                    }
                    else if (rawScore >=  9&& rawScore <= 12) {
                        return 5; 
                    }
                    else if (rawScore >= 13 && rawScore <= 16) {
                        return 6; 
                    }
                    else if (rawScore >= 17 && rawScore <= 19) {
                        return 7; 
                    }
                    else if (rawScore >= 20 && rawScore <= 21) {
                        return 8; 
                    }
                    else if (rawScore === 22) {
                        return 9; 
                    }
                break;
                case 'L':
                    if (rawScore >=  0&& rawScore <= 1) {
                        return 1; 
                    } else if (rawScore >= 2 && rawScore <= 3) {
                        return 2; 
                    }
                    else if (rawScore >= 4 && rawScore <= 5) {
                        return 3; 
                    }
                    else if (rawScore >= 6 && rawScore <= 7) {
                        return 4; 
                    }
                    else if (rawScore >=  8&& rawScore <= 10) {
                        return 5; 
                    }
                    else if (rawScore >=  11&& rawScore <= 13) {
                        return 6; 
                    }
                    else if (rawScore >=  14&& rawScore <=15 ) {
                        return 7; 
                    }
                    else if (rawScore >=  16&& rawScore <= 17) {
                        return 8; 
                    }
                    else if (rawScore >= 18 && rawScore <= 19) {
                        return 9; 
                    }
                    else if (rawScore ===20) {
                        return 10; 
                    }
                break;
                case 'M':
                    if (rawScore ===0 ) {
                        return 2; 
                    } else if (rawScore ===1 ) {
                        return 3; 
                    }
                    else if (rawScore >= 2 && rawScore <= 3) {
                        return 4; 
                    }
                    else if (rawScore >=  4&& rawScore <= 6) {
                        return 5; 
                    }
                    else if (rawScore >=  7&& rawScore <=10 ) {
                        return 6; 
                    }
                    else if (rawScore >= 11 && rawScore <= 14) {
                        return 7; 
                    }
                    else if (rawScore >=  15&& rawScore <= 18) {
                        return 8; 
                    }
                    else if (rawScore >= 19 && rawScore <= 20) {
                        return 9; 
                    }
                    else if (rawScore >= 21 && rawScore <=22 ) {
                        return 10; 
                    }
                break;
                case 'N':
                    if (rawScore ===0 ) {
                        return 1; 
                    } else if (rawScore >= 1 && rawScore <=2 ) {
                        return 2; 
                    }
                    else if (rawScore >=  3&& rawScore <=4 ) {
                        return 3; 
                    }
                    else if (rawScore >= 5 && rawScore <= 7) {
                        return 4; 
                    }
                    else if (rawScore >=  8&& rawScore <= 10) {
                        return 5; 
                    }
                    else if (rawScore >=  11&& rawScore <= 14) {
                        return 6; 
                    }
                    else if (rawScore >= 15 && rawScore <=17 ) {
                        return 7; 
                    }
                    else if (rawScore >=  18&& rawScore <=19 ) {
                        return 8; 
                    }
                    else if (rawScore ===20 ) {
                        return 9; 
                    }
                break;
                case 'O':
                    if (rawScore >= 0 && rawScore <=1 ) {
                        return 2; 
                    } else if (rawScore >= 2 && rawScore <= 3) {
                        return 3; 
                    }
                    else if (rawScore >= 4 && rawScore <=6 ) {
                        return 4; 
                    }
                    else if (rawScore >=  7&& rawScore <= 10) {
                        return 5; 
                    }
                    else if (rawScore >= 11 && rawScore <=14 ) {
                        return 6; 
                    }
                    else if (rawScore >= 15 && rawScore <= 17) {
                        return 7; 
                    }
                    else if (rawScore >=  18&& rawScore <= 19) {
                        return 8; 
                    }
                    else if (rawScore===20 ) {
                        return 9; 
                    }
                break;
                case 'Q1':
                    if (rawScore >=  0&& rawScore <= 4) {
                        return 1; 
                    } else if (rawScore >= 5 && rawScore <=7 ) {
                        return 2; 
                    }
                    else if (rawScore >=  8&& rawScore <= 9) {
                        return 3; 
                    }
                    else if (rawScore >= 10 && rawScore <= 13 ) {
                        return 4; 
                    }
                    else if (rawScore >=  14&& rawScore <= 17) {
                        return 5; 
                    }
                    else if (rawScore >= 18 && rawScore <=20 ) {
                        return 6; 
                    }
                    else if (rawScore >= 21 && rawScore <= 23) {
                        return 7; 
                    }
                    else if (rawScore >= 24 && rawScore <= 25) {
                        return 8; 
                    }
                    else if (rawScore >= 26 && rawScore <= 27 ) {
                        return 9; 
                    }
                    else if (rawScore === 28) {
                        return 10; 
                    }
                break;
                case 'Q2':
                    if (rawScore ===0 ) {
                        return 2; 
                    } else if (rawScore ===1 ) {
                        return 3; 
                    }
                    else if (rawScore >= 2 && rawScore <=3 ) {
                        return 4; 
                    }
                    else if (rawScore >= 4 && rawScore <=6 ) {
                        return 5; 
                    }
                    else if (rawScore >= 7 && rawScore <= 10) {
                        return 6; 
                    }
                    else if (rawScore >=  11&& rawScore <=14 ) {
                        return 7; 
                    }
                    else if (rawScore >=  15&& rawScore <= 16) {
                        return 8; 
                    }
                    else if (rawScore >=  17&& rawScore <=18 ) {
                        return 9; 
                    }
                    else if (rawScore >=  19&& rawScore <= 20) {
                        return 10; 
                    }
                break;
                case 'Q3':
                    if (rawScore >= 0 && rawScore <=1 ) {
                        return 1; 
                    } else if (rawScore >= 2 && rawScore <= 3) {
                        return 2; 
                    }
                    else if (rawScore >= 4 && rawScore <=5 ) {
                        return 3; 
                    }
                    else if (rawScore >= 6 && rawScore <= 8) {
                        return 4; 
                    }
                    else if (rawScore >= 9 && rawScore <= 12) {
                        return 5; 
                    }
                    else if (rawScore >=  13&& rawScore <=15 ) {
                        return 6; 
                    }
                    else if (rawScore >= 16 && rawScore <= 17) {
                        return 7; 
                    }
                    else if (rawScore ===18 ) {
                        return 8; 
                    }
                    else if (rawScore >=  19&& rawScore <= 20 ) {
                        return 9; 
                    }
                break;
                case 'Q4':
                    if (rawScore >= 0 && rawScore <= 1) {
                        return 2; 
                    } else if (rawScore >= 2 && rawScore <=3 ) {
                        return 3; 
                    }
                    else if (rawScore >= 4 && rawScore <= 6) {
                        return 4; 
                    }
                    else if (rawScore >=  7&& rawScore <=10 ) {
                        return 5; 
                    }
                    else if (rawScore >= 11 && rawScore <= 14) {
                        return 6; 
                    }
                    else if (rawScore >=  15&& rawScore <=17 ) {
                        return 7; 
                    }
                    else if (rawScore >= 18 && rawScore <=19 ) {
                        return 8; 
                    }
                    else if (rawScore === 20 ) {
                        return 9; 
                    }

                break;

    }
    // Default to 1 if no custom logic applies
    return 1;
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
  const [results, setResults] = useState<User16PFTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [userID, setUserID] = useState<string | null>(null);
  const [editingTestID, setEditingTestID] = useState<string | null>(null); // Track the testID of the item being edited
  const [updatedData, setUpdatedData] = useState<Partial<User16PFTest>>({}); // Store updated data for the current test

  const resultsPerPage = 8;
  const navigate = useNavigate();

  

  // Define the factor order
  const factorOrder = ['A', 'B', 'C', 'E', 'F', 'G', 'H', 'I', 'L', 'M', 'N', 'O', 'Q1', 'Q2', 'Q3', 'Q4'];

  // Function to sort the scoring based on the factor order
  const sortedScoring = (scoring: { factorLetter: string; rawScore: number; stenScore: number }[]) => {
    return scoring.sort((a, b) => {
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


  return (
    <div>
      <h2>PF Results List (for Pyhsical)</h2>
     
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
                <th>Test Date</th>
                <th>Scores</th>
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
                          <th>Factor Letter</th>
                          <th>Raw Score</th>
                          <th>Sten Score</th>
                          <th>Results Interpretation</th>
                        </tr>
                      </thead>
                      <tbody>
                      {sortedScoring(result.scoring).map((score) => {
                        if (score) {
                            const { leftMeaning, rightMeaning } = getFactorDescription(score.factorLetter);
                            const stenScore = calculateStenScore(score.rawScore, score.factorLetter);

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
                            <tr key={score.factorLetter}>
                              <td>{score.factorLetter}</td>
                              <td>{score.rawScore}</td>
                              <td>{stenScore}</td>
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

export default PFOmrList;
