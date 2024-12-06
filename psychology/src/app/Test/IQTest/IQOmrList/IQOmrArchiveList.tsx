import React, { useState, useEffect } from 'react';
import styles from './IQOmrArchiveList.module.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



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

const IQOmrArchivedList: React.FC = () => {
  const [results, setResults] = useState<OMR[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;

 


 

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/omr/isTrue/archived/all');
      
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
        const iqTestResponse = await fetch('http://localhost:5000/api/IQtest/67277ea7aacfc314004dca20');
        if (!iqTestResponse.ok) {
          throw new Error(`Failed to fetch IQ test: ${iqTestResponse.statusText}`);
        }
        const iqTestData = await iqTestResponse.json();
        const interpretations: Interpretation[] = iqTestData.interpretation;
  
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
      await axios.delete(`http://localhost:5000/api/omr/test/delete/${testID}`);
      setResults((prevConsultations) =>
        prevConsultations.filter((consultation) => consultation.testID !== testID)
      );
      alert("IQ Result deleted successfully.");
    } catch (error) {
      console.error("Error deleting IQ Result:", error);
      alert("Failed to delete IQ Result.");
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
        <div className={styles.floatingContainer}>
          <h2>IQ Results List (Physical)
          <p className={styles.resultCount}>
  Total Archived Results: {results.length}
</p>
             </h2>
      
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
                    <th>Total Score</th>
                    <th>Interpretation</th>
                    <th>Action</th>
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
                      <td>{result.totalScore}</td>
                      <td>
                        <li>Interpretation: {result.interpretation?.resultInterpretation ?? 'N/A'}</li>
                      </td>
                      <td>
                        <button className={styles.archiveButtons} onClick={() => handleDelete(result.testID)}>
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

export default IQOmrArchivedList;
