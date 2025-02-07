import React, { useState, useEffect } from 'react';
import styles from './CFOmrArchiveList.module.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import backendUrl from '../../../../config';



interface Interpretation {
  
  minAge: number;
  maxAge: number;
  minTestScore: number;
  maxTestScore: number;
  resultInterpretation: string;
}




interface OMR {
    userID: string;
    firstName: string;
    lastName: string;
    age: number;  // Changed from string to number
    sex: 'Female' | 'Male';
    course: string;
    year: number;
    section: number;
    testID: string;
    totalScore: number; // Include totalScore here
    interpretation: Interpretation;
    testType: 'Online' | 'Physical';
    testDate: Date;
}

const CFOmrArchivedList: React.FC = () => {
  const [results, setResults] = useState<OMR[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;

 


 

  const fetchData = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/omrcf/isTrue/archived/all`);
      
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
        const cfTestResponse = await fetch(`${backendUrl}/api/CFtest/67a09ef7e3fdfebbf170a124`);
        if (!cfTestResponse.ok) {
          throw new Error(`Failed to fetch CF test: ${cfTestResponse.statusText}`);
        }
        const cfTestData = await cfTestResponse.json();
        const interpretations: Interpretation[] = cfTestData.interpretation;
  
        const resultWithInterpretation = data.data.map((result: OMR) => {
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
                  resultInterpretation: interpretation.resultInterpretation,
                }
              : { resultInterpretation: 'No interpretation available' },
          };
        });
  
        setResults(resultWithInterpretation);
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

  const handleDelete = async (testID: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this result?");
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`${backendUrl}/api/omrcf/test/delete/${testID}`);
      setResults((prevConsultations) =>
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
      const response = await fetch(`${backendUrl}/api/omrcf/unarchive/${testID}`, {
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

  if (loading) return <div className={styles.loading}>Loading...</div>;
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
          <h2>CF Results List (Physical)
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
                    <th>Total Score</th>
                    <th>Interpretation</th>
                    <th>Action</th>
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
                      <td>{result.totalScore}</td>
                      <td>
                        <li>Interpretation: {result.interpretation?.resultInterpretation ?? 'N/A'}</li>
                      </td>
                      <td>
                      <button 
                      className={styles.restoreButtonIQLIST} 
                      onClick={() => handleRestore(result.testID)}
                    >
                      Restore
                    </button>
                    <br/>
                        <button className={styles.deleteButtonCFLIST} onClick={() => handleDelete(result.testID)}>
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
            <p>There are no archived results yet.</p>
          )}
        </div>
      );
      
};

export default CFOmrArchivedList;
