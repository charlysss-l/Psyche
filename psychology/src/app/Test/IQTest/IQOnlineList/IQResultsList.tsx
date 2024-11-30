import React, { useState, useEffect } from 'react';
import styles from './IQResultsList.module.scss'; // Import your CSS module
import { useNavigate } from 'react-router-dom';
import IQOnlineArchiveList from './IQOnlineArchiveList';

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

interface UserIQTest {
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

const IQResultsList: React.FC = () => {
  const [results, setResults] = useState<UserIQTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 3;
  const navigate = useNavigate();

  const [isArchivedListVisible, setIsArchivedListVisible] = useState(false);

  const toggleArchivedList = () => {
    setIsArchivedListVisible(!isArchivedListVisible);
  };

  

  const fetchData = async () => {
    try {
      setLoading(true); // Ensure loading is displayed while fetching
      const response = await fetch('http://localhost:5000/api/useriq');
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
  
      const iqTestResponse = await fetch('http://localhost:5000/api/IQtest/67277ea7aacfc314004dca20');
      if (!iqTestResponse.ok) {
        throw new Error(`Failed to fetch IQ test: ${iqTestResponse.statusText}`);
      }
      const iqTestData = await iqTestResponse.json();
      const interpretations: Interpretation[] = iqTestData.interpretation;
  
      const resultsWithInterpretation = data.data.map((result: UserIQTest) => {
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
  
      // Replace state directly
      setResults(resultsWithInterpretation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    fetchData();
  }, []);

  const handleArchive = async (testID: string) => {
    try {
        console.log(`Archiving test with ID: ${testID}`);  // Log to ensure the correct testID

        // Use the testID in the API request
        const response = await fetch(`http://localhost:5000/api/useriq/archive/${testID}`, {
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





  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.errorMessage}>Error: {error}</div>;

  // Calculate the total number of pages
  const totalPages = Math.ceil(results.length / resultsPerPage);

  // Slice results based on the current page
  const currentResults = results.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  return (
    
    <div>
      
      <h2>IQ Results List  <button
      className={isArchivedListVisible ? styles.closeButton : styles.archiveButton}
      onClick={toggleArchivedList}
    >
      {isArchivedListVisible ? 'Close' : 'Archive List'}
    </button>
  </h2>
  {isArchivedListVisible && <IQOnlineArchiveList />}

      
      

    
      {results.length > 0 ? (
        <div>
          
          <table className={styles.resultsTableIQ}>
            
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
                <tr key={result.userID} className={styles.eachResultIQ}>
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

export default IQResultsList;
