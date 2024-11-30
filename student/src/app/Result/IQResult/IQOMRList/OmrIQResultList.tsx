import React, { useState, useEffect } from 'react';
import styles from './OmrIQ.module.scss'; // Import your CSS module
import { useNavigate } from 'react-router-dom';

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
  section: number;
  testID: string;
  totalScore: number;
  interpretation: Interpretation;
  testType: 'Online' | 'Physical';
  testDate: Date;
}

const OmrIQResultsList: React.FC = () => {
  const [results, setResults] = useState<OMR[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const [editingTestID, setEditingTestID] = useState<string | null>(null); // Track the testID of the item being edited
  const [updatedData, setUpdatedData] = useState<Partial<OMR>>({}); // Store updated data for the current test
  const navigate = useNavigate();

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
      const response = await fetch(`http://localhost:5000/api/omr/${userID}`);
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

  

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/omr/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error deleting the test: ${response.statusText}`);
      }

      setResults(results.filter((result) => result.userID !== id));
      window.location.reload();

      navigate('/iqresultlistboth');
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
      const response = await fetch(`http://localhost:5000/api/omr/test/${testID}`, {
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

  return (
    <div>
      <h2>IQ Results List (by Physical) <p className={styles.ageWarning}>*Your Age Must Be 20 years old and Above to see the Interpretation.</p></h2>

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
              {results.map((result) => (
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
                        <option value="BSCS">BSCS</option>
                        <option value="BSIT">BSIT</option>
                        <option value="BSBA">BSBA</option>
                        <option value="BSECE">BSECE</option>
                        <option value="BSCE">BSCE</option>
                        <option value="BSED">BSED</option>
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
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                      </select>
                    ) : (
                      result.year
                    )}
                  </td>
                  <td>
                    {editingTestID === result.testID ? (
                      <select
                        value={updatedData.section}
                        onChange={(e) => setUpdatedData({ ...updatedData, section: Number(e.target.value) })}
                      >
                        <option value="" disabled>Select</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                        <option value={6}>6</option>
                        <option value={7}>7</option>
                        <option value={8}>8</option>
                        <option value={9}>9</option>
                        
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
                      className={styles.deleteButtonIQLIST}
                      onClick={() => handleDelete(result.userID)}
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
                        className={styles.updateButtonIQLIST}
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
        </div>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
};

export default OmrIQResultsList;
