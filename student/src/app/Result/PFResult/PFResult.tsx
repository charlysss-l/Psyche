import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './studentpfresult.module.scss';
import { useNavigate } from 'react-router-dom';

import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';


interface TestResultData {
    userID: string;
    firstName: string;
    lastName: string;
    age: string;
    sex: 'Male' | 'Female';
    course: string;
    year: number;
    section: number;
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

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


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
    const navigate = useNavigate();
    const [results, setResults] = useState<TestResultData | null>(null);

    const factorOrder = ['A', 'B', 'C', 'E', 'F', 'G', 'H', 'I', 'L', 'M', 'N', 'O', 'Q1', 'Q2', 'Q3', 'Q4'];

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

    const sortedScoring = results.scoring.sort((a, b) => {
        const indexA = factorOrder.indexOf(a.factorLetter);
        const indexB = factorOrder.indexOf(b.factorLetter);
        return indexA - indexB;
    });


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
        navigate('/home');
    };

    const chartData = {
        labels: sortedScoring.map((score) => score.factorLetter), // Factor Letters on x-axis in order
        datasets: [
            {
                label: 'Sten Score',
                data: sortedScoring.map((score) =>
                    calculateStenScore(score.rawScore, score.factorLetter)
                ), // Calculate sten scores dynamically
                borderColor: 'rgba(75, 192, 192, 1)', // Line color
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Fill color
                tension: 0.4, // Smooth curve
                borderWidth: 2,
            },
        ],
    };
    
    // Define chart options
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Factor Letter',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Sten Score',
                },
                min: 1,
                max: 10,
                grid: {
                    drawOnChartArea: true,
                    color: (context: any) => {
                        const yValue = context.tick.value;
                        // Apply gray background color to grid lines for Sten 4-7
                        if (yValue >= 4 && yValue <= 7) {
                            return 'rgba(128, 128, 128, 1)'; 
                        }
                        return 'rgba(0, 0, 0, 0.1)'; 
                    },
                },
            },
        },
    };
    
    
    return (
        <div className={styles.container}>
        <h2 className={styles.heading}>{results.firstName} {results.lastName}</h2>
        <div className={styles.info}>
            <strong>User ID:</strong> <span>{results.userID}</span>
        </div>
        <div className={styles.info}>
            <strong>Age:</strong> <span>{results.age}</span>
        </div>
        <div className={styles.info}>
            <strong>Sex:</strong> <span>{results.sex}</span>
        </div>
        <div className={styles.info}>
            <strong>Course:</strong> <span>{results.course}</span>
        </div>
        <div className={styles.info}>
            <strong>Year and Section:</strong> <span>{results.year} - {results.section}</span>
        </div>
        <div className={styles.info}>
            <strong>Test Type:</strong> <span>{results.testType}</span>
        </div>
    
        <h3 className={styles.subheading}>Test Result</h3>
        <div className={styles.chartContainer}>
            <Line data={chartData} options={chartOptions} />;
        </div>
    
        <div className={styles.resultTable}>
                <table>
                    <thead>
                        <tr>
                            <th>Factor Letter</th>
                            <th> Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedScoring.map((score) => (
                            <tr key={score.factorLetter}>
                                <td>{score.factorLetter}</td>
                                <td>{calculateStenScore(score.rawScore, score.factorLetter)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
        </div>

        <div className={styles.sharePrompt}>
            <p>Would you like to share your result with our guidance counselor?</p>
            <button onClick={handleShareResult} className={styles.buttonYes}>Yes</button>
            <button onClick={handleCancel} className={styles.buttonCancel}>No</button>
        </div>
    </div>
    
    );
};

export default PFResult;