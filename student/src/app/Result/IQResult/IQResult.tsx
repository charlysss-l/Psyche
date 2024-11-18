import React, { useEffect, useState } from 'react';
import styles from './IQResult.module.scss';
import { useNavigate } from 'react-router-dom';

interface IQTestResultData {
    userID: string;
    firstName: string;
    lastName: string;
    age: number;
    sex: 'Male' | 'Female';
    course: string;
    year: number;
    section: number;
    testType: 'Online' | 'Physical';
    totalScore: number;
}

interface Interpretation {
    minAge: number;
    maxAge: number;
    minTestScore: number;
    maxTestScore: number;
    percentilePoints: number;
    resultInterpretation: string;
}

const IQResult: React.FC = () => {
    const navigate = useNavigate();
    const [result, setResult] = useState<IQTestResultData | null>(null);
    const [interpretation, setInterpretation] = useState<Interpretation | null>(null);

    useEffect(() => {
        const storedResults = localStorage.getItem('iqTestResults');
        if (storedResults) {
            const parsedResults: IQTestResultData = JSON.parse(storedResults);
            setResult(parsedResults);

            // Fetch the IQ test data based on the test ID to retrieve interpretations
            fetch(`http://localhost:5000/api/IQtest/67277ea7aacfc314004dca20`)
                .then(response => response.json())
                .then(data => {
                    const matchedInterpretation = data.interpretation.find((interp: Interpretation) => 
                        parsedResults.age >= interp.minAge &&
                        parsedResults.age <= interp.maxAge &&
                        parsedResults.totalScore >= interp.minTestScore &&
                        parsedResults.totalScore <= interp.maxTestScore
                    );
                    setInterpretation(matchedInterpretation);
                })
                .catch(error => console.error('Error fetching interpretation data:', error));
        }
    }, []);

    const handleShareResult = () => {
        alert('Your result has been shared with the guidance counselor.');
    };

    const handleCancel = () => {
        alert('Result sharing cancelled.');
        navigate('/home');
    };

    return (
        <div className={styles.container}>
            {result ? (
                <div>
                    <h2 className={styles.header}>{result.firstName} {result.lastName}</h2>
                    <div className={styles.section}>
                        <span className={styles.label}>User ID:</span>
                        <span className={styles.value}>{result.userID}</span>
                    </div>
                    <div className={styles.section}>
                        <span className={styles.label}>Age:</span>
                        <span className={styles.value}>{result.age}</span>
                    </div>
                    <div className={styles.section}>
                        <span className={styles.label}>Sex:</span>
                        <span className={styles.value}>{result.sex}</span>
                    </div>
                    <div className={styles.section}>
                        <span className={styles.label}>Course:</span>
                        <span className={styles.value}>{result.course}</span>
                    </div>
                    <div className={styles.section}>
                        <span className={styles.label}>Year and Section:</span>
                        <span className={styles.value}>{result.year} - {result.section}</span>
                    </div>
                    <div className={styles.section}>
                        <span className={styles.label}>Test Type:</span>
                        <span className={styles.value}>{result.testType}</span>
                    </div>
                    <div className={styles.scoreSection}>
                        <h3>Score</h3>
                        <p>Total Score: <span className={styles.score}>{result.totalScore}</span></p>
                    </div>
                    <div className={styles.interpretationSection}>
                        
                        {interpretation ? (
                            <>
                            <h3>Interpretation: {interpretation.resultInterpretation} </h3>
                            </>
                        ) : (
                            <p>No interpretation available for this score and age range.</p>
                        )}
                        <div className={styles.sharePrompt}>
                            <p>Would you like to share your result with our guidance counselor?</p>
                            <button onClick={handleShareResult} className={styles.buttonYes}>Yes</button>
                            <button onClick={handleCancel} className={styles.buttonCancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            ) : (
                <p className={styles.noResults}>No results available. Please complete the test.</p>
            )}
        </div>
    );
};

export default IQResult;
