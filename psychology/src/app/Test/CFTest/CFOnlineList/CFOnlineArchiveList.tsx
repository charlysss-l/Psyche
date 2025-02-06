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








  if (error) return <div className={styles.errorMessage}>Error: {error}</div>;

  // Calculate the total number of pages
  const totalPages = Math.ceil(archivedResults.length / resultsPerPage);

  // Slice results based on the current page
  const currentResults = archivedResults.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  return (
    <div className={styles.floatingContainer}>
      <h2>Archive CF Results List (Online)
      <p className={styles.resultCount}>
  Total Archived Results: {archivedResults.length}
</p>
      </h2>
  
      {archivedResults.length > 0 ? (
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
                  <td><button className={styles.deleteButtonCFLIST} onClick={() => handleDelete(result.testID)}>
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
