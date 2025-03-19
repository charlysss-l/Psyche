import React, { useState, useEffect } from 'react';
import styles from './IQInterpretation.module.scss';
import { useNavigate } from 'react-router-dom';
import backendUrl from '../../../../config';

interface Interpretation {
  byId: string;
  minAge: number;
  maxAge: number;
  minTestScore: number;
  maxTestScore: number;
  percentilePoints: number;
  resultInterpretation: string;
  _id: string;
}

interface IQTest {
  _id: string;
  testID: string;
  nameOfTest: string;
  numOfQuestions: number;
  questions: string[];
  interpretation: Interpretation[];
}

const IQInterpretation: React.FC = () => {
  const [iqTest, setIqTest] = useState<IQTest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch the IQTest data
  const fetchData = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/IQtest/67277ea7aacfc314004dca20`);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      setIqTest(data);
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
    if (!iqTest) return;
    const updatedInterpretation = [...iqTest.interpretation];
    updatedInterpretation[index] = {
      ...updatedInterpretation[index],
      [field]: value,
    };
    setIqTest({ ...iqTest, interpretation: updatedInterpretation });
  };

  const handleSave = async (index: number) => {
    if (!iqTest) return;
    const updatedInterpretation = iqTest.interpretation[index];
    
    try {
      const response = await fetch(`${backendUrl}/api/IQtest/${iqTest._id}/interpretation/${updatedInterpretation.byId}`, {
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
      setIqTest({
        ...iqTest,
        interpretation: iqTest.interpretation.map((item, i) =>
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
      <h2>Edit IQ Test Interpretation</h2>
      {iqTest && (
        <div>
          <h3>Raven's Standard Progressive Matrices</h3>

          {/* Show success message if any */}
          {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

          <table className={styles.interpretationTable}>
            <thead>
              <tr>
                <th>Age Range</th>
                <th>Score Range</th>
                <th>Percentile Points</th>
                <th>Interpretation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {iqTest.interpretation.map((interpretation, index) => (
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
                    <button className={styles.savebutton} onClick={() => handleSave(index)}>Save</button>
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

export default IQInterpretation;
