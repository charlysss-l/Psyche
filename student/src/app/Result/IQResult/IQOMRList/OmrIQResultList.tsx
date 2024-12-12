import React, { useState, useEffect } from 'react';
import styles from './OmrIQ.module.scss'; // Import your CSS module
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
  age: number;
  sex: 'Female' | 'Male';
  course: string;
  year: number;
  section: string;
  testID: string;
  totalScore: number;
  interpretation: Interpretation;
  testType: 'Online' | 'Physical';
  testDate: Date;
  uploadURL: string;
}

const OmrIQResultsList: React.FC = () => {
  const [results, setResults] = useState<OMR[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const [editingTestID, setEditingTestID] = useState<string | null>(null); // Track the testID of the item being edited
  const [updatedData, setUpdatedData] = useState<Partial<OMR>>({}); // Store updated data for the current test
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;
  const [modalImageURL, setModalImageURL] = useState<string | null>(null); // State for modal image URL
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  useEffect(() => {
    const storedUserID = localStorage.getItem('userId');
    if (storedUserID) {
      setUserID(storedUserID);
    } else {
      setError('User ID not found. Please log in again.');
    }
  }, []);

  const fetchData = async () => {
    if (!userID) return;

    try {
      const response = await fetch(`${backendUrl}/api/omr/${userID}`);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();

      const iqTestResponse = await fetch(`${backendUrl}/api/IQtest/67277ea7aacfc314004dca20`);
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
  }, [userID]);

  const handleViewImage = (uploadURL: string) => {
    setModalImageURL(uploadURL);
    setIsModalOpen(true); // Open modal when image view button is clicked
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close modal
    setModalImageURL(null);
  };
  

  const handleDelete = async (testID: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this test?");
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`${backendUrl}/api/omr/test/${testID}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error(`Error deleting the test: ${response.statusText}`);
      }
  
      // Remove the deleted test from the state
      setResults(results.filter((result) => result.testID !== testID));
      alert("Test Result deleted successfully.");

      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error deleting test:', err);
    }
  };

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

  const handleUpdate = async (testID: string) => {

    
    try {
      const response = await fetch(`${backendUrl}/api/omr/test/${testID}`, {
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

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.errorMessage}>Error: {error}</div>;

  const totalPages = Math.ceil(results.length / resultsPerPage);
  const currentResults = results.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);

  return (
    <div>
      <h2 className={styles.iqresultitle}>IQ Results List (Physical) 
        <p className={styles.ageWarning}>*Your Age Must Be 20 years old and Above to see the Interpretation.

        <p className={styles.resultCount}>
  Total Results: {results.length}
</p>
        </p>
      
      </h2>

      {results.length > 0 ? (
        <div>
          <table className={styles.resultsTableIQ}>
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
                <th>Test ID</th>
                <th>Test Date</th>
                <th>Total Score</th>
                <th>Interpretation</th>
                <th>Actions</th>
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
                        <option value="BSEduc">Bachelor of Secondary Education</option>
                <option value="BSBM">BS Business Management</option>
                <option value="BSCS">BS Computer Science</option>
                <option value="BSCrim">BS Criminology</option>
                <option value="BSHM">BS Hospitality Management</option>                    
                <option value="BSIT">BS Information Technology</option>
                <option value="BSP">BS Psychology</option>
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
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                    ) : (
                      result.year
                    )}
                  </td>
                  <td>
                    {editingTestID === result.testID ? (
                      <select
                        value={updatedData.section}
                        onChange={(e) => setUpdatedData({ ...updatedData, section: e.target.value })}
                      >
                        <option value="" disabled>Select</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="Irregular">Irregular</option>
                        
                      </select>
                    ) : (
                      result.section
                    )}
                  </td>
                  <td>{result.testType}</td>
                  <td>{result.testID}</td>
                  <td>{new Date(result.testDate).toLocaleDateString()}</td>
                  <td>{result.totalScore}</td>
                  <td>{result.interpretation.resultInterpretation ?? 'N/A'}</td>
                  <td>
                  <button
                      className={styles.viewImageButton}
                      onClick={() => handleViewImage(result.uploadURL)}
                    >
                      View Image
                    </button>
                    <button
                      className={styles.deleteButtonIQLIST}
                      onClick={() => handleDelete(result.testID)}
                    >
                      Delete
                    </button>
                    <button
                      className={styles.updateButtonIQLIST}
                      onClick={() => handleEditClick(result.testID)}
                    >
                      Edit
                    </button>
                    
                    {editingTestID === result.testID && (
                      <button
                        className={styles.saveButtonIQLIST}
                        onClick={() => handleUpdate(result.testID)}
                      >
                        Save
                      </button>
                      
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

           {/* Modal for displaying image */}
           {isModalOpen && modalImageURL && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={closeModal}>
                  X
                </button>
                <img src={modalImageURL} alt="Uploaded Image" className={styles.modalImage} />
              </div>
            </div>
          )}

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
        <p>No results found</p>
      )}
    </div>
  );
};

export default OmrIQResultsList;
