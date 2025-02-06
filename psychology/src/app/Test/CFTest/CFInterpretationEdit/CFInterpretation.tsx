import React, { useState, useEffect } from 'react';
import styles from './CFInterpretation.module.scss';
import { useNavigate } from 'react-router-dom';
import backendUrl from '../../../../config';

interface Interpretation {
  byId: string;
  minAge: number;
  maxAge: number;
  minTestScore: number;
  maxTestScore: number;
  iqScore: number;
  percentilePoints: number;
  resultInterpretation: string;
  _id: string;
}

interface CFTest {
  _id: string;
  testID: string;
  nameOfTest: string;
  numOfQuestions: number;
  questions: string[];
  interpretation: Interpretation[];
}

const CFInterpretation: React.FC = () => {
  const [cfTest, setCfTest] = useState<CFTest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch the CFTest data
  const fetchData = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/CFtest/67a09ef7e3fdfebbf170a124`);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      setCfTest(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (index: number, field: string, value: string | number) => {
    if (!cfTest) return;
    const updatedInterpretation = [...cfTest.interpretation];
    updatedInterpretation[index] = {
      ...updatedInterpretation[index],
      [field]: value,
    };
    setCfTest({ ...cfTest, interpretation: updatedInterpretation });
  };

  const handleSave = async (index: number) => {
    if (!cfTest) return;
    const updatedInterpretation = cfTest.interpretation[index];
    
    try {
      const response = await fetch(`${backendUrl}/api/CFtest/${cfTest._id}/interpretation/${updatedInterpretation.byId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedInterpretation),
      });

      if (!response.ok) {
        throw new Error(`Failed to update interpretation: ${response.statusText}`);
      }

      // Update the local state after saving
      setCfTest({
        ...cfTest,
        interpretation: cfTest.interpretation.map((item, i) =>
          i === index ? updatedInterpretation : item
        ),
      });

      // Show success message
      setSuccessMessage('Interpretation updated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.errorMessage}>Error: {error}</div>;

  return (
    <div>
      <h2>Edit CF Test Interpretation</h2>
      {cfTest && (
        <div>
          <h3>Measuring Intelligence with the Culture Fair Test</h3>

          {/* Show success message if any */}
          {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

          <table className={styles.interpretationTable}>
            <thead>
              <tr>
                <th>Age Range</th>
                <th>Score Range</th>
                <th>IQ Points</th>
                <th>Percentile Points</th>
                <th>Interpretation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cfTest.interpretation.map((interpretation, index) => (
                <tr key={interpretation._id}>
                  <td className={styles.rangeCell}>
                    <div className={styles.rangeInput}>
                      <input
                        type="number"
                        value={interpretation.minAge}
                        onChange={(e) => handleInputChange(index, 'minAge', +e.target.value)}
                        className={styles.inputLeft}
                      />
                      <span>-</span>
                      <input
                        type="number"
                        value={interpretation.maxAge}
                        onChange={(e) => handleInputChange(index, 'maxAge', +e.target.value)}
                        className={styles.inputRight}
                      />
                    </div>
                  </td>
                  <td className={styles.rangeCell}>
                    <div className={styles.rangeInput}>
                      <input
                        type="number"
                        value={interpretation.minTestScore}
                        onChange={(e) => handleInputChange(index, 'minTestScore', +e.target.value)}
                        className={styles.inputLeft}
                      />
                      <span>-</span>
                      <input
                        type="number"
                        value={interpretation.maxTestScore}
                        onChange={(e) => handleInputChange(index, 'maxTestScore', +e.target.value)}
                        className={styles.inputRight}
                      />
                    </div>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={interpretation.iqScore}
                      onChange={(e) => handleInputChange(index, 'iqScore', +e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={interpretation.percentilePoints}
                      onChange={(e) => handleInputChange(index, 'percentilePoints', +e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={interpretation.resultInterpretation}
                      onChange={(e) => handleInputChange(index, 'resultInterpretation', e.target.value)}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleSave(index)}>Save</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CFInterpretation;
