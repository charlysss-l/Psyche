import React, { useState, useEffect } from 'react';
import styles from './CFOnlineArchiveList.module.scss'; // Import your CSS module
import axios from 'axios';
import backendUrl from '../../../../config';

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
}

const CFOnlineArchiveList: React.FC = () => {
  const [archivedResults, setArchivedResults] = useState<UserCFTest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  

const fetchData = async () => {
  try {
    const response = await fetch(`${backendUrl}/api/usercf/isTrue/archived/all`);

    if (response.status === 404) {
      // Handle 404 as no archived results
      setError(null);
      setArchivedResults([]);
      setLoading(false);
      return;
    }

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();

    if (data.data.length === 0) {
      setError('No archived results yet.');
      setArchivedResults([]);
    } else {
    // Fetch CF test interpretation data
    const cfTestResponse = await fetch(`${backendUrl}/api/CFtest/67a09ef7e3fdfebbf170a124`);
    if (!cfTestResponse.ok) {
      throw new Error(`Failed to fetch CF test: ${cfTestResponse.statusText}`);
    }
    const cfTestData = await cfTestResponse.json();
    const interpretations: Interpretation[] = cfTestData.interpretation;

    // Add interpretation to each result
    const resultsWithInterpretation = data.data.map((result: UserCFTest) => {
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

    setArchivedResults(resultsWithInterpretation);
    setError(null);
      }
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An unknown error occurred');
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchData();
}, []);


  if (loading) return <div>Loading...</div>;
  if (error) return <div className={styles.errorMessage}>Error: {error}</div>;

  const handleDelete = async (testID: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this result?");
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`${backendUrl}/api/usercf/test/delete/${testID}`);
      setArchivedResults((prevConsultations) =>
        prevConsultations.filter((consultation) => consultation.testID !== testID)
      );
      alert("CF Result deleted successfully.");
    } catch (error) {
      console.error("Error deleting CF Result:", error);
      alert("Failed to delete CF Result.");
    }
  };


  const handleRestore = async (testID: string) => {
    const confirmRemove = window.confirm("Are you sure you want to restore this test?");
    if (!confirmRemove) return;

  try {
      console.log(`Archiving test with ID: ${testID}`);  // Log to ensure the correct testID

      // Use the testID in the API request
      const response = await fetch(`${backendUrl}/api/usercf/unarchive/${testID}`, {
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



  const filteredUsers = archivedResults.filter((result) => {
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





  if (error) return <div className={styles.errorMessage}>Error: {error}</div>;

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredUsers.length / resultsPerPage);

  // Slice results based on the current page
  const currentResults = filteredUsers.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  return (
    <div className={styles.floatingContainer}>
      <h2>Archive CF Results List (Online)
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
          <table className={styles.resultsTableCF}>
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
                <tr  className={styles.eachResultCF}>
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
                    <div className={styles.responsesWrapper}>
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
                    </div>
                  </td>
                  <td>{result.totalScore}</td>
                  <td>Percentile: {result.interpretation?.percentilePoints ?? 'N/A'} <br/><br/>
                    Interpretation: {result.interpretation?.resultInterpretation ?? 'N/A'}</td>
                  <td>
                  <button 
                      className={styles.restoreButtonCF} 
                      onClick={() => handleRestore(result.testID)}
                    >
                      Restore
                    </button>
                    <button className={styles.deleteButtonCFLIST} onClick={() => handleDelete(result.testID)}>
                      Delete
                    </button></td>
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

export default CFOnlineArchiveList;
