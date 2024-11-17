import React, { useEffect, useState } from 'react';
import styles from './IQResult.module.scss';
import { Navigate, useNavigate } from 'react-router-dom';

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
    interpretation?: {
        percentile: number;
        result: string;
    };
}

const IQResult: React.FC = () => {
    const navigate = useNavigate();
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
        
        //20-24 Age
          if (age >= 20 && age <= 24 && score == 0) {
            return { percentile: 5, result: 'Intellectually Impaired' };
        } else if (age >= 20 && age <= 24 && score >= 1 && score <= 23) {
            return { percentile: 5, result: 'Intellectually Impaired' };
        } else if (age >= 20 && age <= 24 && score >= 24 && score <= 28) {
            return { percentile: 10, result: 'Intellectually Impaired' };
        } else if (age >= 20 && age <= 24 && score >= 29 && score <= 37) {
            return { percentile: 25, result: 'Below Average In Intellectual Capacity' };
        } else if (age >= 20 && age <= 24 && score >= 38 && score <= 44) {
            return { percentile: 50, result: 'Intellectually Average' };
        } else if (age >= 20 && age <= 24 && score >= 45 && score <= 49) {
            return { percentile: 75, result: 'Intellectually Average' };
        } else if (age >= 20 && age <= 24 && score >= 50 && score <= 54) {
            return { percentile: 90, result: 'Above Average In Intellectual Capacity' };
        } else if (age >= 20 && age <= 24 && score >= 55 && score <= 60) {
            return { percentile: 95, result: 'Intellectually Superior' };
        }

        //25-29 Age         
          else if (age >= 25 && age <= 29 && score == 0) {
            return { percentile: 5, result: 'Intellectually Impaired' };
        } else if (age >= 25 && age <= 29 && score >= 1 && score <= 23) {
            return { percentile: 5, result: 'Intellectually Impaired' };
        } else if (age >= 25 && age <= 29 && score >= 24 && score <= 28) {
            return { percentile: 10, result: 'Intellectually Impaired' };
        } else if (age >= 25 && age <= 29 && score >= 29 && score <= 37) {
            return { percentile: 25, result: 'Below Average In Intellectual Capacity' };
        } else if (age >= 25 && age <= 29 && score >= 38 && score <= 44) {
            return { percentile: 50, result: 'Intellectually Average' };
        } else if (age >= 25 && age <= 29 && score >= 45 && score <= 49) {
            return { percentile: 75, result: 'Intellectually Average' };
        } else if (age >= 25 && age <= 29 && score >= 50 && score <= 54) {
            return { percentile: 90, result: 'Above Average In Intellectual Capacity' };
        } else if (age >= 25 && age <= 29 && score >= 55 && score <= 60) {
            return { percentile: 95, result: 'Intellectually Superior' };
        }

        //30-34 Age
          else if (age >= 30 && age <= 34 && score == 0) {
            return { percentile: 5, result: 'Intellectually Impaired' };
        } else if (age >= 30 && age <= 34 && score >= 1 && score <= 19) {
            return { percentile: 5, result: 'Intellectually Impaired' };
        } else if (age >= 30 && age <= 34 && score >= 20 && score <= 25) {
            return { percentile: 10, result: 'Intellectually Impaired' };
        } else if (age >= 30 && age <= 34 && score >= 26 && score <= 34) {
            return { percentile: 25, result: 'Below Average In Intellectual Capacity' };
        } else if (age >= 30 && age <= 34 && score >= 35 && score <= 42) {
            return { percentile: 50, result: 'Intellectually Average' };
        } else if (age >= 30 && age <= 34 && score >= 43 && score <= 47) {
            return { percentile: 75, result: 'Intellectually Average' };
        } else if (age >= 30 && age <= 34 && score >= 48 && score <= 53) {
            return { percentile: 90, result: 'Above Average In Intellectual Capacity' };
        } else if (age >= 30 && age <= 34 && score >= 54 && score <= 60) {
            return { percentile: 95, result: 'Intellectually Superior' };
        }

        //35-39 Age
           else if (age >= 35 && age <= 39 && score >= 0 && score <= 30) {
            return { percentile: 25, result: 'Below Average In Intellectual Capacity' };
        } else if (age >= 35 && age <= 39 && score >= 31 && score <= 40) {
            return { percentile: 50, result: 'Intellectually Average' };
        } else if (age >= 35 && age <= 39 && score >= 41 && score <= 45) {
            return { percentile: 75, result: 'Intellectually Average' };
        } else if (age >= 35 && age <= 39 && score >= 46 && score <= 51) {
            return { percentile: 90, result: 'Above Average In Intellectual Capacity' };
        } else if (age >= 35 && age <= 39 && score >= 52 && score <= 60) {
            return { percentile: 95, result: 'Intellectually Superior' };
        }

        //40-44 Age
          else if (age >= 40 && age <= 44 && score >= 0 && score <= 27) {
            return { percentile: 25, result: 'Below Average In Intellectual Capacity' };
        } else if (age >= 40 && age <= 44 && score >= 28 && score <= 38) {
            return { percentile: 50, result: 'Intellectually Average' };
        } else if (age >= 40 && age <= 44 && score >= 39 && score <= 43) {
            return { percentile: 75, result: 'Intellectually Average' };
        } else if (age >= 40 && age <= 44 && score >= 44 && score <= 49) {
            return { percentile: 90, result: 'Above Average In Intellectual Capacity' };
        } else if (age >= 40 && age <= 44 && score >= 50 && score <= 60) {
            return { percentile: 95, result: 'Intellectually Superior' };
        }

        //45-49 Age
          else if (age >= 45 && age <= 49 && score >= 0 && score <= 24) {
            return { percentile: 25, result: 'Below Average In Intellectual Capacity' };
        } else if (age >= 45 && age <= 49 && score >= 25 && score <= 35) {
            return { percentile: 50, result: 'Intellectually Average' };
        } else if (age >= 45 && age <= 49 && score >= 36 && score <= 41) {
            return { percentile: 75, result: 'Intellectually Average' };
        } else if (age >= 45 && age <= 49 && score >= 42 && score <= 47) {
            return { percentile: 90, result: 'Above Average In Intellectual Capacity' };
        } else if (age >= 45 && age <= 49 && score >= 48 && score <= 60) {
            return { percentile: 95, result: 'Intellectually Superior' };
        }

        //50-54 Age
          else if (age >= 50 && age <= 54 && score >= 0 && score <= 21) {
            return { percentile: 25, result: 'Below Average In Intellectual Capacity' };
        } else if (age >= 50 && age <= 54 && score >= 22 && score <= 33) {
            return { percentile: 50, result: 'Intellectually Average' };
        } else if (age >= 50 && age <= 54 && score >= 34 && score <= 39) {
            return { percentile: 75, result: 'Intellectually Average' };
        } else if (age >= 50 && age <= 54 && score >= 40 && score <= 45) {
            return { percentile: 90, result: 'Above Average In Intellectual Capacity' };
        } else if (age >= 50 && age <= 54 && score >= 46 && score <= 60) {
            return { percentile: 95, result: 'Intellectually Superior' };
        }

        //55-59 Age
           else if (age >= 55 && age <= 59 && score >= 0 && score <= 18) {
            return { percentile: 25, result: 'Below Average In Intellectual Capacity' };
        } else if (age >= 55 && age <= 59 && score >= 19 && score <= 30) {
            return { percentile: 50, result: 'Intellectually Average' };
        } else if (age >= 55 && age <= 59 && score >= 31 && score <= 37) {
            return { percentile: 75, result: 'Intellectually Average' };
        } else if (age >= 55 && age <= 59 && score >= 38 && score <= 43) {
            return { percentile: 90, result: 'Above Average In Intellectual Capacity' };
        } else if (age >= 55 && age <= 59 && score >= 44 && score <= 60) {
            return { percentile: 95, result: 'Intellectually Superior' };
        }

        //60-64 Age
           else if (age >= 60 && age <= 64 && score >= 0 && score <= 15) {
            return { percentile: 25, result: 'Below Average In Intellectual Capacity' };
        } else if (age >= 60 && age <= 64 && score >= 16 && score <= 27) {
            return { percentile: 50, result: 'Intellectually Average' };
        } else if (age >= 60 && age <= 64 && score >= 28 && score <= 35) {
            return { percentile: 75, result: 'Intellectually Average' };
        } else if (age >= 60 && age <= 64 && score >= 36 && score <= 41) {
            return { percentile: 90, result: 'Above Average In Intellectual Capacity' };
        } else if (age >= 60 && age <= 64 && score >= 42 && score <= 60) {
            return { percentile: 95, result: 'Intellectually Superior' };
        }

        //65 Age and above
          else if (age >= 65 && score >= 0 && score <= 13) {
            return { percentile: 25, result: 'Below Average In Intellectual Capacity' };
        } else if (age >= 65 && score >= 14 && score <= 24) {
            return { percentile: 50, result: 'Intellectually Average' };
        } else if (age >= 65 && score >= 25 && score <= 33) {
            return { percentile: 75, result: 'Intellectually Average' };
        } else if (age >= 65 && score >= 34 && score <= 39) {
            return { percentile: 90, result: 'Above Average In Intellectual Capacity' };
        } else if (age >= 65 && score >= 40 && score <= 60) {
            return { percentile: 95, result: 'Intellectually Superior' };
        }
    };

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
                    {result.interpretation && (
                        <div className={styles.interpretationSection}>
                            <h3>Interpretation: {result.interpretation.result}</h3>
                            
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
