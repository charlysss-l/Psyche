import React, { useState, useEffect } from 'react';
import styles from './CFResultsList.module.scss'; // Import your CSS module
import CFOnlineArchiveList from './CFOnlineArchiveList';
import * as XLSX from 'xlsx';
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
  isArchived: boolean;
}

const CFResultsList: React.FC = () => {
  const [results, setResults] = useState<UserCFTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 3;
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isArchivedListVisible, setIsArchivedListVisible] = useState(false);
  const toggleArchivedList = () => {
    setIsArchivedListVisible(!isArchivedListVisible);
  };

  

  const fetchData = async () => {
    try {
      setLoading(true); // Ensure loading is displayed while fetching
      const response = await fetch(`${backendUrl}/api/usercf`);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
  
      const cfTestResponse = await fetch(`${backendUrl}/api/CFtest/67a09ef7e3fdfebbf170a124`);
      if (!cfTestResponse.ok) {
        throw new Error(`Failed to fetch CF test: ${cfTestResponse.statusText}`);
      }
      const cfTestData = await cfTestResponse.json();
      const interpretations: Interpretation[] = cfTestData.interpretation;

          // Filter out archived results
    const filteredResults = data.data.filter((result: UserCFTest) => !result.isArchived);
  
      const resultsWithInterpretation = filteredResults.map((result: UserCFTest) => {
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
  
   
    setResults(resultsWithInterpretation); // Update results to show only non-archived results
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

  const handleArchive = async (testID: string) => {
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
        alert('Test archived successfully.');
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error archiving test:', err);
    }
};

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
    totalScore: result.totalScore,
    interpretation: result.interpretation ? result.interpretation.resultInterpretation : 'No interpretation available',
  })));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'CF Results');
  
  // Generate Excel file and prompt user to download
  XLSX.writeFile(workbook, 'CFResults (Online).xlsx');
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
    
    <div>
      
      <h2 className={styles.title}>CF Results List (Online) 
      <div className={styles.buttonsWrapper}>
      <input
        type="text"
        placeholder="Search by User ID, Name, Sex, Course, Date"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />
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
  Total Results: {filteredUsers.length}
</p>

  {isArchivedListVisible && <CFOnlineArchiveList />}

      
      

    
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
                <tr className={styles.eachResultCF}>
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
                  <td><button className={styles.archiveButtons} onClick={() => handleArchive(result.testID)}>
                      Archive
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

export default CFResultsList;
