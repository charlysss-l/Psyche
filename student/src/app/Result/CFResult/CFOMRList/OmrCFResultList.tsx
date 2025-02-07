import React, { useState, useEffect } from 'react';
import styles from './OmrCF.module.scss'; // Import your CSS module
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
  isArchived: boolean;
}

const OmrCFResultsList: React.FC = () => {
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
  const [searchTerm, setSearchTerm] = useState<string>("");

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
      const response = await fetch(`${backendUrl}/api/omrcf/test/${userID}`);
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
  

  const handleRemove = async (testID: string) => {
    const confirmRemove = window.confirm("Are you sure you want to delete this test?");
    if (!confirmRemove) return;

  try {
      console.log(`Archiving test with ID: ${testID}`);  // Log to ensure the correct testID

      // Use the testID in the API request
      const response = await fetch(`${backendUrl}/api/omrcf/archive/${testID}`, {
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
      // Fetch the CF test interpretations again to get the latest interpretation logic
      const cfTestResponse = await fetch(`${backendUrl}/api/CFtest/67a09ef7e3fdfebbf170a124`);
      if (!cfTestResponse.ok) {
        throw new Error(`Failed to fetch CF test: ${cfTestResponse.statusText}`);
      }
      const cfTestData = await cfTestResponse.json();
      const interpretations: Interpretation[] = cfTestData.interpretation;
  
      // Find the updated interpretation based on the new age and total score
      const updatedInterpretation = interpretations.find(
        (interp) =>
          updatedData.age! >= interp.minAge &&
          updatedData.age! <= interp.maxAge &&
          results.find((result) => result.testID === testID)!.totalScore >= interp.minTestScore &&
          results.find((result) => result.testID === testID)!.totalScore <= interp.maxTestScore
      );
  
      // Prepare the data to be sent to the backend
      const dataToUpdate = {
        ...updatedData,
        interpretation: updatedInterpretation
          ? {
              resultInterpretation: updatedInterpretation.resultInterpretation,
            }
          : { resultInterpretation: 'No interpretation available' },
      };
  
      // Send the update request to the backend
      const response = await fetch(`${backendUrl}/api/omrcf/test/${testID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToUpdate),
      });
  
      if (!response.ok) {
        throw new Error(`Error updating the test: ${response.statusText}`);
      }
  
      const updatedResult = await response.json();
      setResults((prevResults) =>
        prevResults.map((result) =>
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

  const filteredUsers = results
  .filter(result => !result.isArchived) // Exclude archived results
  .filter((result) => {
    const normalizedDate = normalizeDate(result.testDate); // Normalize the date for comparison
    const normalizedSearchTerm = normalizeSearchTerm(searchTerm); // Normalize the search term
    return [
      result.testID,
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

  const totalPages = Math.ceil(filteredUsers.length / resultsPerPage);
  const currentResults = filteredUsers.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);

  return (
    <div>
      <h2 className={styles.title}>CF Results List (Physical) <span className={styles.ageWarning}>*Your Age Must Be 20 years old and Above to see the Interpretation.
      </span>
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
        <div>
          <table className={styles.resultsTableCF}>
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
                <tr key={result.testID} className={styles.eachResultCF}>
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
                      className={styles.deleteButtonCFLIST}
                      onClick={() => handleRemove(result.testID)}
                    >
                      Delete
                    </button>
                    <br/>
                    <button
                      className={styles.updateButtonCFLIST}
                      onClick={() => handleEditClick(result.testID)}
                    >
                      Edit
                    </button>
                    
                    {editingTestID === result.testID && (
                      <button
                        className={styles.saveButtonCFLIST}
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

export default OmrCFResultsList;
