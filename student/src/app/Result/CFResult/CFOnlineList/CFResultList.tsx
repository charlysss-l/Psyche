import React, { useState, useEffect } from 'react';
import styles from './CFResultList.module.scss'; // Import your CSS module
import backendUrl from '../../../../config';

interface Response {
  questionID: string;
  selectedChoice: string | string[];
  isCorrect: boolean;
}

interface Interpretation {
  byId: string; // This will automatically be assigned by MongoDB
  minAge: number;  
  maxAge: number;
  minTestScore: number;
  maxTestScore: number;
  iqScore: number;
  percentilePoints: number;
  resultInterpretation: string;
}

interface UserCFTest {
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
  isArchived: boolean;
}

const CFResultsList: React.FC = () => {
  const [results, setResults] = useState<UserCFTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;

  // Fetch userID from localStorage and set it in state
  useEffect(() => {
    const storedUserID = localStorage.getItem('userId');
    if (storedUserID) {
      setUserID(storedUserID);
    } else {
      setError('User ID not found. Please log in again.');
    }
  }, []);

  // Fetch data based on userID
  const fetchData = async () => {
    if (!userID) return; // Don't fetch if userID is not available

    try {
      const response = await fetch(`${backendUrl}/api/usercf/${userID}`);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();

      // Fetch CF test interpretation data
      const cfTestResponse = await fetch(`${backendUrl}/api/CFtest/67a09ef7e3fdfebbf170a124`);
      if (!cfTestResponse.ok) {
        throw new Error(`Failed to fetch CF test: ${cfTestResponse.statusText}`);
      }
      const cfTestData = await cfTestResponse.json();
      const interpretations: Interpretation[] = cfTestData.interpretation;

      // Add interpretation to the user's result
      const resultWithInterpretation = data.data.map((result: UserCFTest) => {
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

      setResults(resultWithInterpretation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userID) {
      fetchData();
    }
  }, [userID]); // Trigger fetchData when userID changes

  // const handleDelete = async (testID: string) => {
  //   const confirmDelete = window.confirm("Are you sure you want to delete this test?");
  //   if (!confirmDelete) return;
  
  //   try {
  //     const response = await fetch(`${backendUrl}/api/usercf/test/${testID}`, {
  //       method: 'DELETE',
  //     });
  
  //     if (!response.ok) {
  //       throw new Error(`Error deleting the test: ${response.statusText}`);
  //     }
  
  //     // Remove the deleted test from the state
  //     setResults(results.filter((result) => result.testID !== testID));
  //     alert("Test Result deleted successfully.");

  //     window.location.reload();
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : 'An unknown error occurred');
  //     console.error('Error deleting test:', err);
  //   }
  // };

  const handleRemove = async (testID: string) => {
    const confirmRemove = window.confirm("Are you sure you want to delete this test?");
    if (!confirmRemove) return;

  try {
      console.log(`Archiving test with ID: ${testID}`);  // Log to ensure the correct testID

      // Use the testID in the API request
      const response = await fetch(`${backendUrl}/api/usercf/archive/${testID}`, {
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

const filteredUsers = results
  .filter(result => !result.isArchived) // Exclude archived results
  .filter(result => {
    const normalizedDate = normalizeDate(result.testDate);
    const normalizedSearchTerm = normalizeSearchTerm(searchTerm);
    return [result.testID, normalizedDate]
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
  

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.errorMessage}>Error: {error}</div>;

  const totalPages = Math.ceil(filteredUsers.length / resultsPerPage);
  const currentResults = filteredUsers.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);

  return (
    <div>
     <h2 className={styles.title}>CF Results List (Online)
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
          <table className={styles.resultsTableCF}>
            <thead>
              <tr>
                <th>userID</th>
                {/* <th>Name</th>
                <th>Age</th>
                <th>Sex</th>
                <th>Course</th>
                <th>Year</th>
                <th>Section</th>
                <th>Test Type</th> */}
                <th>Test ID</th>
                <th>Test Date</th>
                <th>Total Score</th>
                <th>Interpretation</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentResults.map((result) => (
                <tr key={result.userID} className={styles.eachResultCF}>
                  <td>{result.userID}</td>
                  {/* <td>{result.firstName} {result.lastName}</td>
                  <td>{result.age}</td>
                  <td>{result.sex}</td>
                  <td>{result.course}</td>
                  <td>{result.year}</td>
                  <td>{result.section}</td>
                  <td>{result.testType}</td> */}
                  <td>{formatTestID(result.testID)}</td>
                  <td>{new Date(result.testDate).toLocaleDateString()}</td>
                  
                  <td>{result.totalScore}</td>
                  <td>
                    {result.interpretation?.resultInterpretation ?? 'N/A'}
                  </td>
                  <td>
                    <button 
                      className={styles.deleteButtonCFLIST} 
                      onClick={() => handleRemove(result.testID)}
                    >
                      Delete
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
        <p>No results found.</p>
      )}
    </div>
  );
};

export default CFResultsList;
