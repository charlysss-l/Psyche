import React, { useState, useEffect } from 'react';
import styles from './IQOnlineArchiveList.module.scss'; // Import your CSS module
import axios from 'axios';

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

const IQOnlineArchiveList: React.FC = () => {
  const [archivedResults, setArchivedResults] = useState<UserIQTest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;
  const [loading, setLoading] = useState(true);

  

const fetchData = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/useriq/isTrue/archived/all');
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();

    // Fetch IQ test interpretation data
    const iqTestResponse = await fetch('http://localhost:5000/api/IQtest/67277ea7aacfc314004dca20');
    if (!iqTestResponse.ok) {
      throw new Error(`Failed to fetch IQ test: ${iqTestResponse.statusText}`);
    }
    const iqTestData = await iqTestResponse.json();
    const interpretations: Interpretation[] = iqTestData.interpretation;

    // Add interpretation to each result
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

    setArchivedResults(resultsWithInterpretation);
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
      await axios.delete(`http://localhost:5000/api/useriq/test/delete/${testID}`);
      setArchivedResults((prevConsultations) =>
        prevConsultations.filter((consultation) => consultation.testID !== testID)
      );
      alert("IQ Result deleted successfully.");
    } catch (error) {
      console.error("Error deleting IQ Result:", error);
      alert("Failed to delete IQ Result.");
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
      <h2>Archive IQ Results List</h2>
  
      {archivedResults.length > 0 ? (
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
                <tr  className={styles.eachResultIQ}>
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
                  <td><button className={styles.deleteButtonIQLIST} onClick={() => handleDelete(result.testID)}>
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

export default IQOnlineArchiveList;
