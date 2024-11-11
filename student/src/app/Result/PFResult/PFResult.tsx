import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './studentpfresult.module.scss';

interface TestResultData {
    userID: string;
    firstName: string;
    lastName: string;
    age: string;
    sex: 'Male' | 'Female';
    courseSection: string;
    testType: 'Online' | 'Physical';
    responses: {
        questionID: string;
        selectedChoice: string;
        equivalentScore: number;
        factorLetter: string;
    }[] | [];
    scoring: {
        factorLetter: string;
        rawScore: number;
        stenScore: number;
    }[] | [];
}

// Function to calculate stenScore based on rawScore and factorLetter
const calculateStenScore = (rawScore: number, factorLetter: string): number => {
    // Factor-specific mappings
    switch (factorLetter) {
        case 'A':
            if (rawScore >= 0 && rawScore <= 3) {
                return 1; // Factor A custom mapping
            }else if (rawScore >= 4 && rawScore <= 5) {
                return 2; 
            } else if (rawScore >= 6 && rawScore <= 8) {
                return 3; 
            }else if (rawScore >= 9 && rawScore <= 11) {
                return 4; 
            }
            else if (rawScore >= 12 && rawScore <= 14) {
                return 5; 
            }
            else if (rawScore >= 15 && rawScore <= 17) {
                return 6; 
            }
            else if (rawScore >= 18 && rawScore <= 19) {
                return 7; 
            }
            else if (rawScore === 20) {
                return 8; 
            }
            else if (rawScore >= 21 && rawScore <= 22) {
                return 9; 
            }
            break;
        case 'B':
            if (rawScore >= 0 && rawScore <= 3) {
                return 1; 
            } else if (rawScore === 4) {
                return 2; 
            }
            else if (rawScore >=  5 && rawScore <= 6 ) {
                return 3; 
            }
            else if (rawScore >= 7 && rawScore <= 8) {
                return 4; 
            }
            else if (rawScore >= 9 && rawScore <= 10) {
                return 5; 
            }
            else if (rawScore >=  11 && rawScore <= 12) {
                return 6; 
            }
            else if (rawScore === 13 ) {
                return 7; 
            }
            else if (rawScore === 14 ) {
                return 8; 
            }
            else if (rawScore === 15 ) {
                return 9; 
            }
            break;
            case 'C':
                if (rawScore >= 0 && rawScore <= 2 ) {
                    return 1; 
                } else if (rawScore >= 3 && rawScore <= 5 ) {
                    return 2; 
                }
                else if (rawScore >= 6 && rawScore <= 8) {
                    return 3; 
                }
                else if (rawScore >= 9 && rawScore <= 12 ) {
                    return 4; 
                }
                else if (rawScore >=  13 && rawScore <= 16) {
                    return 5; 
                }
                else if (rawScore >= 17  && rawScore <= 18 ) {
                    return 6; 
                }
                else if (rawScore === 19 ) {
                    return 7; 
                }
                else if (rawScore === 20 ) {
                    return 8; 
                }
                break;
                case 'E':
                    if (rawScore >= 0 && rawScore <= 2) {
                        return 1; 
                    } else if (rawScore >= 3 && rawScore <= 5) {
                        return 2; 
                    }
                    else if (rawScore >= 6 && rawScore <= 8) {
                        return 3; 
                    }
                    else if (rawScore >=  9 && rawScore <= 11) {
                        return 4; 
                    }
                    else if (rawScore >= 12 && rawScore <= 14) {
                        return 5; 
                    }
                    else if (rawScore >=  15 && rawScore <= 17) {
                        return 6; 
                    }
                    else if (rawScore === 18 ) {
                        return 7; 
                    }
                    else if (rawScore === 19 ) {
                        return 8; 
                    }
                    else if (rawScore === 20 ) {
                        return 9; 
                    }
                break;
                case 'G':
                    if (rawScore >=  0&& rawScore <= 2) {
                        return 1; 
                    } else if (rawScore >= 3 && rawScore <= 5) {
                        return 2; 
                    }
                    else if (rawScore >= 6 && rawScore <=8 ) {
                        return 3; 
                    }
                    else if (rawScore >=  9&& rawScore <= 11) {
                        return 4; 
                    }
                    else if (rawScore >=  12&& rawScore <= 15) {
                        return 5; 
                    }
                    else if (rawScore >=  16&& rawScore <= 18 ) {
                        return 6; 
                    }
                    else if (rawScore >=  19&& rawScore <= 20) {
                        return 7; 
                    }
                    else if (rawScore === 21 ) {
                        return 8; 
                    }
                    else if (rawScore === 22 ) {
                        return 9; 
                    }
                break;
                case 'H':
                    if (rawScore >=   0&& rawScore <=1 ) {
                        return 2; 
                    } else if (rawScore >= 2 && rawScore <= 3) {
                        return 3; 
                    }
                    else if (rawScore >= 4 && rawScore <= 7) {
                        return 4; 
                    }
                    else if (rawScore >=  8&& rawScore <=12 ) {
                        return 5; 
                    }
                    else if (rawScore >= 13 && rawScore <= 16) {
                        return 6; 
                    }
                    else if (rawScore >=  17&& rawScore <= 18) {
                        return 7; 
                    }
                    else if (rawScore === 19) {
                        return 8; 
                    }
                    else if (rawScore=== 20 ) {
                        return 9; 
                    }
                break;
                case 'I':
                    if (rawScore === 0 ) {
                        return 1; 
                    } else if (rawScore >= 1 && rawScore <=2 ) {
                        return 2; 
                    }
                    else if (rawScore >=  3&& rawScore <= 5) {
                        return 3; 
                    }
                    else if (rawScore >=  6&& rawScore <=8 ) {
                        return 4; 
                    }
                    else if (rawScore >=  9&& rawScore <= 12) {
                        return 5; 
                    }
                    else if (rawScore >= 13 && rawScore <= 16) {
                        return 6; 
                    }
                    else if (rawScore >= 17 && rawScore <= 19) {
                        return 7; 
                    }
                    else if (rawScore >= 20 && rawScore <= 21) {
                        return 8; 
                    }
                    else if (rawScore === 22) {
                        return 9; 
                    }
                break;
                case 'L':
                    if (rawScore >=  0&& rawScore <= 1) {
                        return 1; 
                    } else if (rawScore >= 2 && rawScore <= 3) {
                        return 2; 
                    }
                    else if (rawScore >= 4 && rawScore <= 5) {
                        return 3; 
                    }
                    else if (rawScore >= 6 && rawScore <= 7) {
                        return 4; 
                    }
                    else if (rawScore >=  8&& rawScore <= 10) {
                        return 5; 
                    }
                    else if (rawScore >=  11&& rawScore <= 13) {
                        return 6; 
                    }
                    else if (rawScore >=  14&& rawScore <=15 ) {
                        return 7; 
                    }
                    else if (rawScore >=  16&& rawScore <= 17) {
                        return 8; 
                    }
                    else if (rawScore >= 18 && rawScore <= 19) {
                        return 9; 
                    }
                    else if (rawScore ===20) {
                        return 10; 
                    }
                break;
                case 'M':
                    if (rawScore ===0 ) {
                        return 2; 
                    } else if (rawScore ===1 ) {
                        return 3; 
                    }
                    else if (rawScore >= 2 && rawScore <= 3) {
                        return 4; 
                    }
                    else if (rawScore >=  4&& rawScore <= 6) {
                        return 5; 
                    }
                    else if (rawScore >=  7&& rawScore <=10 ) {
                        return 6; 
                    }
                    else if (rawScore >= 11 && rawScore <= 14) {
                        return 7; 
                    }
                    else if (rawScore >=  15&& rawScore <= 18) {
                        return 8; 
                    }
                    else if (rawScore >= 19 && rawScore <= 20) {
                        return 9; 
                    }
                    else if (rawScore >= 21 && rawScore <=22 ) {
                        return 10; 
                    }
                break;
                case 'N':
                    if (rawScore ===0 ) {
                        return 1; 
                    } else if (rawScore >= 1 && rawScore <=2 ) {
                        return 2; 
                    }
                    else if (rawScore >=  3&& rawScore <=4 ) {
                        return 3; 
                    }
                    else if (rawScore >= 5 && rawScore <= 7) {
                        return 4; 
                    }
                    else if (rawScore >=  8&& rawScore <= 10) {
                        return 5; 
                    }
                    else if (rawScore >=  11&& rawScore <= 14) {
                        return 6; 
                    }
                    else if (rawScore >= 15 && rawScore <=17 ) {
                        return 7; 
                    }
                    else if (rawScore >=  18&& rawScore <=19 ) {
                        return 8; 
                    }
                    else if (rawScore ===20 ) {
                        return 9; 
                    }
                break;
                case 'O':
                    if (rawScore >= 0 && rawScore <=1 ) {
                        return 2; 
                    } else if (rawScore >= 2 && rawScore <= 3) {
                        return 3; 
                    }
                    else if (rawScore >= 4 && rawScore <=6 ) {
                        return 4; 
                    }
                    else if (rawScore >=  7&& rawScore <= 10) {
                        return 5; 
                    }
                    else if (rawScore >= 11 && rawScore <=14 ) {
                        return 6; 
                    }
                    else if (rawScore >= 15 && rawScore <= 17) {
                        return 7; 
                    }
                    else if (rawScore >=  18&& rawScore <= 19) {
                        return 8; 
                    }
                    else if (rawScore===20 ) {
                        return 9; 
                    }
                break;
                case 'Q1':
                    if (rawScore >=  0&& rawScore <= 4) {
                        return 1; 
                    } else if (rawScore >= 5 && rawScore <=7 ) {
                        return 2; 
                    }
                    else if (rawScore >=  8&& rawScore <= 9) {
                        return 3; 
                    }
                    else if (rawScore >= 10 && rawScore <= 13 ) {
                        return 4; 
                    }
                    else if (rawScore >=  14&& rawScore <= 17) {
                        return 5; 
                    }
                    else if (rawScore >= 18 && rawScore <=20 ) {
                        return 6; 
                    }
                    else if (rawScore >= 21 && rawScore <= 23) {
                        return 7; 
                    }
                    else if (rawScore >= 24 && rawScore <= 25) {
                        return 8; 
                    }
                    else if (rawScore >= 26 && rawScore <= 27 ) {
                        return 9; 
                    }
                    else if (rawScore === 28) {
                        return 10; 
                    }
                break;
                case 'Q2':
                    if (rawScore ===0 ) {
                        return 2; 
                    } else if (rawScore ===1 ) {
                        return 3; 
                    }
                    else if (rawScore >= 2 && rawScore <=3 ) {
                        return 4; 
                    }
                    else if (rawScore >= 4 && rawScore <=6 ) {
                        return 5; 
                    }
                    else if (rawScore >= 7 && rawScore <= 10) {
                        return 6; 
                    }
                    else if (rawScore >=  11&& rawScore <=14 ) {
                        return 7; 
                    }
                    else if (rawScore >=  15&& rawScore <= 16) {
                        return 8; 
                    }
                    else if (rawScore >=  17&& rawScore <=18 ) {
                        return 9; 
                    }
                    else if (rawScore >=  19&& rawScore <= 20) {
                        return 10; 
                    }
                break;
                case 'Q3':
                    if (rawScore >= 0 && rawScore <=1 ) {
                        return 1; 
                    } else if (rawScore >= 2 && rawScore <= 3) {
                        return 2; 
                    }
                    else if (rawScore >= 4 && rawScore <=5 ) {
                        return 3; 
                    }
                    else if (rawScore >= 6 && rawScore <= 8) {
                        return 4; 
                    }
                    else if (rawScore >= 9 && rawScore <= 12) {
                        return 5; 
                    }
                    else if (rawScore >=  13&& rawScore <=15 ) {
                        return 6; 
                    }
                    else if (rawScore >= 16 && rawScore <= 17) {
                        return 7; 
                    }
                    else if (rawScore ===18 ) {
                        return 8; 
                    }
                    else if (rawScore >=  19&& rawScore <= 20 ) {
                        return 9; 
                    }
                break;
                case 'Q4':
                    if (rawScore >= 0 && rawScore <= 1) {
                        return 2; 
                    } else if (rawScore >= 2 && rawScore <=3 ) {
                        return 3; 
                    }
                    else if (rawScore >= 4 && rawScore <= 6) {
                        return 4; 
                    }
                    else if (rawScore >=  7&& rawScore <=10 ) {
                        return 5; 
                    }
                    else if (rawScore >= 11 && rawScore <= 14) {
                        return 6; 
                    }
                    else if (rawScore >=  15&& rawScore <=17 ) {
                        return 7; 
                    }
                    else if (rawScore >= 18 && rawScore <=19 ) {
                        return 8; 
                    }
                    else if (rawScore === 20 ) {
                        return 9; 
                    }

                break;

    }
    // Default to 1 if no custom logic applies
    return 1;
};

const PFResult: React.FC = () => {
    const [results, setResults] = useState<TestResultData | null>(null);

    useEffect(() => {
        // Retrieve results from local storage
        const storedResults = localStorage.getItem('pfTestResults');
        if (storedResults) {
            setResults(JSON.parse(storedResults));
        }
    }, []);

    if (!results) {
        return (
            <div className={styles.container}>
                <p className={styles.noResults}>No results available. Please complete the test.</p>
            </div>
        );
    }

    // Submit results to the backend
    const submitResultsToBackend = async () => {
        if (!results) return;

        const updatedScoring = results.scoring.map(score => {
            const stenScore = calculateStenScore(score.rawScore, score.factorLetter);
            return { ...score, stenScore };
        });

        const resultData = {
            ...results,
            scoring: updatedScoring,
        };

        try {
            const response = await fetch('http://localhost:5000/api/user16pf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(resultData),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Your result has been shared with the guidance counselor.');
            } else {
                alert('There was an error sharing the result.');
            }
        } catch (error) {
            console.error('Error submitting result:', error);
            alert('An error occurred while submitting the results.');
        }
    };

    const handleShareResult = () => {
        submitResultsToBackend();
    };

    const handleCancel = () => {
        alert('Result sharing cancelled.');
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Test Results for {results.firstName} {results.lastName}</h2>
            <p className={styles.info}>User ID: {results.userID}</p>
            <p className={styles.info}>Age: {results.age}</p>
            <p className={styles.info}>Sex: {results.sex}</p>
            <p className={styles.info}>Course Section: {results.courseSection}</p>
            <p className={styles.info}>Test Type: {results.testType}</p>

            <h3 className={styles.subheading}>Scoring Summary</h3>
            {results.scoring && results.scoring.length > 0 ? (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Factor Letter</th>
                            <th>Raw Score</th>
                            <th>Sten Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.scoring.map((score, index) => {
                            const stenScore = calculateStenScore(score.rawScore, score.factorLetter);
                            return (
                                <tr key={index}>
                                    <td>{score.factorLetter}</td>
                                    <td>{score.rawScore}</td>
                                    <td>{stenScore}</td> {/* Display the calculated stenScore */}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            ) : (
                <p>No scoring data available.</p>
            )}

            <h3 className={styles.subheading}>Responses</h3>
            {results.responses && results.responses.length > 0 ? (
                <ul className={styles.responseList}>
                    {results.responses.map((response, index) => (
                        <li key={index} className={styles.responseItem}>
                            <p>Question ID: {response.questionID}</p>
                            <p>Selected Choice: {response.selectedChoice}</p>
                            <p>Equivalent Score: {response.equivalentScore}</p>
                            <p>Factor Letter: {response.factorLetter}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No responses available.</p>
            )}

            {/* Share Prompt */}
            <div className={styles.sharePrompt}>
                <p>Would you like to share your result with our guidance counselor?</p>
                <button onClick={handleShareResult} className={styles.buttonYes}>Yes</button>
                <button onClick={handleCancel} className={styles.buttonCancel}>Cancel</button>
            </div>
        </div>
    );
};

export default PFResult;