import React, { useEffect, useState } from 'react';
import styles from './IQResult.module.scss';

interface IQTestResultData {
    userID: string;
    firstName: string;
    lastName: string;
    age: number;
    sex: 'Male' | 'Female';
    testType: 'Online' | 'Physical';
    totalScore: number;
    interpretation?: {
        percentile: number;
        result: string;
    };
}

const IQResult: React.FC = () => {
    const [result, setResult] = useState<IQTestResultData | null>(null);

    useEffect(() => {
        const storedResults = localStorage.getItem('iqTestResults');
        if (storedResults) {
            const parsedResults: IQTestResultData = JSON.parse(storedResults);
            const interpretation = getInterpretation(parsedResults.age, parsedResults.totalScore);
            setResult({ ...parsedResults, interpretation });
        }
    }, []);

    const getInterpretation = (age: number, score: number) => {
        if (age >= 20 && age <= 24 && score <= 3) {
            return { percentile: 5, result: 'Intellectually Impaired' };
        } else if (age >= 20 && age <= 24 && score >= 4) {
            return { percentile: 100, result: 'Intelligent' };
        } else {
            return { percentile: 50, result: 'Average' };
        }
    };

    const handleShareResult = () => {
        alert('Your result has been shared with the guidance counselor.');
    };

    const handleCancel = () => {
        alert('Result sharing cancelled.');
    };

    return (
        <div className={styles.container}>
            {result ? (
                <div>
                    <h2 className={styles.header}>IQ Test Results for {result.firstName} {result.lastName}</h2>
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
                        <span className={styles.label}>Test Type:</span>
                        <span className={styles.value}>{result.testType}</span>
                    </div>
                    <div className={styles.scoreSection}>
                        <h3>Score</h3>
                        <p>Total Score: <span className={styles.score}>{result.totalScore}</span></p>
                    </div>
                    {result.interpretation && (
                        <div className={styles.interpretationSection}>
                            <h3>Interpretation</h3>
                            <p>Percentile: {result.interpretation.percentile}%</p>
                            <p>Interpretation: {result.interpretation.result}</p>
                            
                            {/* Share Prompt */}
                            <div className={styles.sharePrompt}>
                                <p>Would you like to share your result with our guidance counselor?</p>
                                <button onClick={handleShareResult} className={styles.buttonYes}>Yes</button>
                                <button onClick={handleCancel} className={styles.buttonCancel}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <p className={styles.noResults}>No results available. Please complete the test.</p>
            )}
        </div>
    );
};

export default IQResult;
