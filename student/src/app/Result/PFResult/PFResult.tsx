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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


interface TestResultData {
    userID: string;
    firstName: string;
    lastName: string;
    age: string;
    sex: 'Male' | 'Female';
    course: string;
    year: number;
    section: number;
    testID: string;
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
                    if (rawScore >= 0 && rawScore <= 3) { return 1; // Factor A custom mapping
                    }else if (rawScore >= 4 && rawScore <= 5) { return 2; 
                    }else if (rawScore >= 6 && rawScore <= 8) { return 3; 
                    }else if (rawScore >= 9 && rawScore <= 11) { return 4; 
                    }else if (rawScore >= 12 && rawScore <= 14) { return 5; 
                    }else if (rawScore >= 15 && rawScore <= 17) { return 6; 
                    }else if (rawScore >= 18 && rawScore <= 19) { return 7; 
                    }else if (rawScore === 20) { return 8; 
                    }else if (rawScore >= 21 && rawScore <= 22) { return 9; 
                    }break;
                case 'B':
                    if (rawScore >= 0 && rawScore <= 3) { return 1; 
                    }else if (rawScore === 4) { return 2; 
                    }else if (rawScore >=  5 && rawScore <= 6 ) {return 3; 
                    }else if (rawScore >= 7 && rawScore <= 8) {return 4; 
                    }else if (rawScore >= 9 && rawScore <= 10) {return 5; 
                    }else if (rawScore >=  11 && rawScore <= 12) {return 6; 
                    }else if (rawScore === 13 ) {return 7; 
                    }else if (rawScore === 14 ) {return 8; 
                    }else if (rawScore === 15 ) {return 9; 
                    }break;
                case 'C':
                    if (rawScore >= 0 && rawScore <= 2 ) {return 1; 
                    }else if (rawScore >= 3 && rawScore <= 5 ) {return 2; 
                    }else if (rawScore >= 6 && rawScore <= 8) {return 3; 
                    }else if (rawScore >= 9 && rawScore <= 12 ) {return 4; 
                    }else if (rawScore >=  13 && rawScore <= 16) {return 5; 
                    }else if (rawScore >= 17  && rawScore <= 18 ) {return 6; 
                    }else if (rawScore === 19 ) {return 7; 
                    }else if (rawScore === 20 ) {return 8; 
                    }break;
                case 'E':
                    if (rawScore >= 0 && rawScore <= 2) { return 1;
                    }else if (rawScore >= 3 && rawScore <= 5) { return 2;
                    }else if (rawScore >= 6 && rawScore <= 8) { return 3;
                    }else if (rawScore >= 9 && rawScore <= 11) { return 4;
                    }else if (rawScore >= 12 && rawScore <= 14) { return 5;
                    }else if (rawScore >= 15 && rawScore <= 17) { return 6;
                    }else if (rawScore === 18) { return 7;
                    }else if (rawScore === 19) { return 8;
                    }else if (rawScore === 20) { return 9;
                    }break;
                case 'F':
                    if (rawScore >= 0 && rawScore <= 3) { return 2;
                    }else if (rawScore >= 4 && rawScore <= 6) { return 3;
                    }else if (rawScore >= 7 && rawScore <= 9) { return 4;
                    }else if (rawScore >= 10 && rawScore <= 12) { return 5;
                    }else if (rawScore >= 13 && rawScore <= 15) { return 6;
                    }else if (rawScore >= 16 && rawScore <= 17) { return 7;
                    }else if (rawScore === 18) { return 8;
                    }else if (rawScore >= 19 && rawScore <= 20) { return 9;
                    }break;
                case 'G':
                    if (rawScore >= 0 && rawScore <= 2) { return 1;
                    }else if (rawScore >= 3 && rawScore <= 5) { return 2;
                    }else if (rawScore >= 6 && rawScore <= 8) { return 3;
                    }else if (rawScore >= 9 && rawScore <= 11) { return 4;
                    }else if (rawScore >= 12 && rawScore <= 15) { return 5;
                    }else if (rawScore >= 16 && rawScore <= 18) { return 6;
                    }else if (rawScore >= 19 && rawScore <= 20) { return 7;
                    }else if (rawScore === 21) { return 8;
                    }else if (rawScore === 22) { return 9;
                    }break;
                case 'H':
                    if (rawScore >= 0 && rawScore <= 1) { return 2;
                    }else if (rawScore >= 2 && rawScore <= 3) { return 3;
                    }else if (rawScore >= 4 && rawScore <= 7) { return 4;
                    }else if (rawScore >= 8 && rawScore <= 12) { return 5;
                    }else if (rawScore >= 13 && rawScore <= 16) { return 6;
                    }else if (rawScore >= 17 && rawScore <= 18) { return 7;
                    }else if (rawScore === 19) { return 8;
                    }else if (rawScore === 20) { return 9;
                    }break;
                case 'I':
                    if (rawScore === 0) { return 1;
                    }else if (rawScore >= 1 && rawScore <= 2) { return 2;
                    }else if (rawScore >= 3 && rawScore <= 5) { return 3;
                    }else if (rawScore >= 6 && rawScore <= 8) { return 4;
                    }else if (rawScore >= 9 && rawScore <= 12) { return 5;
                    }else if (rawScore >= 13 && rawScore <= 16) { return 6;
                    }else if (rawScore >= 17 && rawScore <= 19) { return 7;
                    }else if (rawScore >= 20 && rawScore <= 21) { return 8;
                    }else if (rawScore === 22) { return 9;
                    }break;
                case 'L':
                    if (rawScore >= 0 && rawScore <= 1) { return 1;
                    }else if (rawScore >= 2 && rawScore <= 3) { return 2;
                    }else if (rawScore >= 4 && rawScore <= 5) { return 3;
                    }else if (rawScore >= 6 && rawScore <= 7) { return 4;
                    }else if (rawScore >= 8 && rawScore <= 10) { return 5;
                    }else if (rawScore >= 11 && rawScore <= 13) { return 6;
                    }else if (rawScore >= 14 && rawScore <= 15) { return 7;
                    }else if (rawScore >= 16 && rawScore <= 17) { return 8;
                    }else if (rawScore >= 18 && rawScore <= 19) { return 9;
                    }else if (rawScore === 20) { return 10;
                    }break;
                case 'M':
                    if (rawScore === 0) { return 2;
                    }else if (rawScore === 1) { return 3;
                    }else if (rawScore >= 2 && rawScore <= 3) { return 4;
                    }else if (rawScore >= 4 && rawScore <= 6) { return 5;
                    }else if (rawScore >= 7 && rawScore <= 10) { return 6;
                    }else if (rawScore >= 11 && rawScore <= 14) { return 7;
                    }else if (rawScore >= 15 && rawScore <= 18) { return 8;
                    }else if (rawScore >= 19 && rawScore <= 20) { return 9;
                    }else if (rawScore >= 21 && rawScore <= 22) { return 10;
                    }break;
                case 'N':
                    if (rawScore === 0) { return 1; } 
                    else if (rawScore >= 1 && rawScore <= 2) { return 2; } 
                    else if (rawScore >= 3 && rawScore <= 4) { return 3; } 
                    else if (rawScore >= 5 && rawScore <= 7) { return 4; } 
                    else if (rawScore >= 8 && rawScore <= 10) { return 5; } 
                    else if (rawScore >= 11 && rawScore <= 14) { return 6; } 
                    else if (rawScore >= 15 && rawScore <= 17) { return 7; } 
                    else if (rawScore >= 18 && rawScore <= 19) { return 8; } 
                    else if (rawScore === 20) { return 9; } 
                    break;
                case 'O':
                    if (rawScore >= 0 && rawScore <= 1) { return 2; } 
                    else if (rawScore >= 2 && rawScore <= 3) { return 3; } 
                    else if (rawScore >= 4 && rawScore <= 6) { return 4; } 
                    else if (rawScore >= 7 && rawScore <= 10) { return 5; } 
                    else if (rawScore >= 11 && rawScore <= 14) { return 6; } 
                    else if (rawScore >= 15 && rawScore <= 17) { return 7; } 
                    else if (rawScore >= 18 && rawScore <= 19) { return 8; } 
                    else if (rawScore === 20) { return 9; } 
                    break;
                case 'Q1':
                    if (rawScore >= 0 && rawScore <= 4) { return 1; } 
                    else if (rawScore >= 5 && rawScore <= 7) { return 2; } 
                    else if (rawScore >= 8 && rawScore <= 9) { return 3; } 
                    else if (rawScore >= 10 && rawScore <= 13) { return 4; } 
                    else if (rawScore >= 14 && rawScore <= 17) { return 5; } 
                    else if (rawScore >= 18 && rawScore <= 20) { return 6; } 
                    else if (rawScore >= 21 && rawScore <= 23) { return 7; } 
                    else if (rawScore >= 24 && rawScore <= 25) { return 8; } 
                    else if (rawScore >= 26 && rawScore <= 27) { return 9; } 
                    else if (rawScore === 28) { return 10; } 
                    break;
                case 'Q2':
                    if (rawScore === 0) { return 2; } 
                    else if (rawScore === 1) { return 3; } 
                    else if (rawScore >= 2 && rawScore <= 3) { return 4; } 
                    else if (rawScore >= 4 && rawScore <= 6) { return 5; } 
                    else if (rawScore >= 7 && rawScore <= 10) { return 6; } 
                    else if (rawScore >= 11 && rawScore <= 14) { return 7; } 
                    else if (rawScore >= 15 && rawScore <= 16) { return 8; } 
                    else if (rawScore >= 17 && rawScore <= 18) { return 9; } 
                    else if (rawScore >= 19 && rawScore <= 20) { return 10; } 
                    break;
                case 'Q3':
                    if (rawScore >= 0 && rawScore <= 1) { return 1; } 
                    else if (rawScore >= 2 && rawScore <= 3) { return 2; } 
                    else if (rawScore >= 4 && rawScore <= 5) { return 3; } 
                    else if (rawScore >= 6 && rawScore <= 8) { return 4; } 
                    else if (rawScore >= 9 && rawScore <= 12) { return 5; } 
                    else if (rawScore >= 13 && rawScore <= 15) { return 6; } 
                    else if (rawScore >= 16 && rawScore <= 17) { return 7; } 
                    else if (rawScore === 18) { return 8; } 
                    else if (rawScore >= 19 && rawScore <= 20) { return 9; } 
                    break;
                case 'Q4':
                    if (rawScore >= 0 && rawScore <= 1) { return 2; } 
                    else if (rawScore >= 2 && rawScore <= 3) { return 3; } 
                    else if (rawScore >= 4 && rawScore <= 6) { return 4; } 
                    else if (rawScore >= 7 && rawScore <= 10) { return 5; } 
                    else if (rawScore >= 11 && rawScore <= 14) { return 6; } 
                    else if (rawScore >= 15 && rawScore <= 17) { return 7; } 
                    else if (rawScore >= 18 && rawScore <= 19) { return 8; } 
                    else if (rawScore === 20) { return 9; } 
                    break;
                

        }
        // Default to 1 if no custom logic applies
        return 1;
    };

    //Function for Factor Description
    const getFactorDescription = (factorLetter: string) => {
        switch (factorLetter) {
            case 'A':
                return {
                    leftMeaning: 'Reserved, Impersonal, Distant',
                    rightMeaning: 'Warm, Outgoing, Attentive to Others',
                };
            case 'B':
                return {
                    leftMeaning: 'Concrete',
                    rightMeaning: 'Abstract',
                };
            case 'C':
                return {
                    leftMeaning: 'Reactive, Emotionally Changeable',
                    rightMeaning: 'Emotionally Stable, Adaptive, Mature',
                };
            case 'E':
                return {
                    leftMeaning: 'Deferential, Cooperative, Avoids Conflict',
                    rightMeaning: 'Dominant, Forceful, Assertive',
                };
            case 'F':
                return {
                    leftMeaning: 'Serious, Restrained, Careful',
                    rightMeaning: 'Lively, Animated, Spontaneous',
                };
            case 'G':
                return {
                    leftMeaning: 'Expedient, Nonconforming',
                    rightMeaning: 'Rule-conscious, Dutiful',
                };
            case 'H':
                return {
                    leftMeaning: 'Shy, Threat-Sensitive, Timid',
                    rightMeaning: 'Socially Bold, Venturesome, Thick Skinned',
                };
            case 'I':
                return {
                    leftMeaning: 'Utilitarian, Objective, Unsentimentak',
                    rightMeaning: 'Sensitive, Aesthetic, Sentimental',
                };
            case 'L':
                return {
                    leftMeaning: 'Trusting, Unsuspecting, Accepting',
                    rightMeaning: 'Vigilant, Suspicious, Skeptical, Wary',
                };
            case 'M':
                return {
                    leftMeaning: 'Grounded, Practical, Solution-Oriented',
                    rightMeaning: 'Abstracted, Imagivative, Idea-Oriented',
                };
            case 'N':
                return {
                    leftMeaning: 'Forthright, Genuine, Artless',
                    rightMeaning: 'Private, Discreet, Non-Disclosing',
                };
            case 'O':
                return {
                    leftMeaning: 'Self-Assured, Unqorried, Complacent',
                    rightMeaning: 'Apprehensive, Self-Doubting, Worried',
                };
            case 'Q1':
                return {
                    leftMeaning: 'Traditional, Attached to Familiar',
                    rightMeaning: 'Open to Change, Experimenting',
                };
            case 'Q2':
                return {
                    leftMeaning: 'Group-Oriented, Affiliative',
                    rightMeaning: 'Self-reliant, Solitary, Individualistic',
                };
            case 'Q3':
                return {
                    leftMeaning: 'Tolerates Disorder, Unexating, Flexible',
                    rightMeaning: 'Perfectionistic, Organized, Self-Disciplined',
                };
            case 'Q4':
                return {
                    leftMeaning: 'Relaxed, Placid, Patient',
                    rightMeaning: 'Tense, High Energy, Impatient, Driven',
                };
            default:
                return {
                    leftMeaning: '',
                    rightMeaning: '',
                };
        }
    };

    const factorDescriptions: Record<string, string> = {
        A: 'Warmth',
        B: 'Reasoning',
        C: 'Emotional Stability',
        E: 'Dominance',
        F: 'Liveliness',
        G: 'Rule-Consciousness',
        H: 'Social Boldness',
        I: 'Sensitivity',
        L: 'Vigilance',
        M: 'Abstractedness',
        N: 'Privateness',
        O: 'Apprehension',
        Q1: 'Openness to Change',
        Q2: 'Self-Reliance',
        Q3: 'Perfectionism',
        Q4: 'Tension',
    };
    
    
const PFResult: React.FC = () => {
    const [isChecked, setIsChecked] = useState(false); // Track checkbox state

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

    const sortedScoring = results.scoring
  .filter((score: any) => factorOrder.includes(score.factorLetter)) // Filter by factorOrder
  .sort((a: any, b: any) => {
    const indexA = factorOrder.indexOf(a.factorLetter);
    const indexB = factorOrder.indexOf(b.factorLetter);
    return indexA - indexB; // Sort based on factorOrder
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
                alert('Please Fill the Consultation Form to schedule a consultation with our Guidance Councelor.');
            } else {
                alert('There was an error sharing the result.');
            }
        } catch (error) {
            console.error('Error submitting result:', error);
            alert('An error occurred while submitting the results.');
        }
    };

    const handleShareResult = () => {
        if (!isChecked) {
            alert("Please agree to share your results by checking the box.");
            return;
        }

        const userConfirmed = window.confirm(
            "Are you sure you want to be consulted and share your result with the guidance counselor?"
        );
        
        if (userConfirmed) {
            submitResultsToBackend();
            navigate('/consultation');

        } else {
            alert("Result sharing cancelled. Your Result has been saved to your Result Page.");
            navigate('/home');

        }
    };
    

    const handleCancel = () => {
        alert('Result sharing cancelled. Your Result has been saved to your Result Page.');
        navigate('/home');
    };

    const chartData = {
        labels: sortedScoring.map((score) => factorDescriptions[score.factorLetter]), // Use descriptions for y-axis
        datasets: [
            {
                label: 'Standard Ten Score (STEN)',
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
    
    const chartOptions = {
        responsive: true,
        indexAxis: 'y' as const, // Switch axes to make the chart horizontal
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
                    text: 'Standard Ten Score (STEN)',
                },
                min: 1,
                max: 10,
                grid: {
                    drawOnChartArea: true,
                    color: (context: any) => {
                        const xValue = context.tick.value;
                        // Apply gray background color to grid lines for Sten 4-7
                        if (xValue >= 4 && xValue <= 7) {
                            return 'rgba(128, 128, 128, 1)'; 
                        }
                        return 'rgba(0, 0, 0, 0.1)';
                    },
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Factors',
                },
            },
        },
    };
    
    const generatePDF = async () => {
        // Get the result container element
        const resultContainer = document.getElementById("result-container");
        if (!resultContainer) return;
    
        // Temporarily hide unwanted elements
        const elementsToHide = resultContainer.querySelectorAll("button, input[type='checkbox'], label, p");
        elementsToHide.forEach(element => {
            if (element instanceof HTMLElement) {
                element.style.display = "none"; // Explicitly hide the element
            }
        });
    
        // Generate canvas from the container
        const canvas = await html2canvas(resultContainer);
        const imgData = canvas.toDataURL("image/png");
    
        // Create PDF document
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
        // Scaling factor to zoom out (e.g., 0.85 for 85% zoom)
        const scaleFactor = 0.85;
    
        // Apply scaling to width and height
        const scaledWidth = pdfWidth * scaleFactor;
        const scaledHeight = pdfHeight * scaleFactor;
    
        // Calculate the X position to center the image
        const xPos = (pdfWidth - scaledWidth) / 2;
    
        // Add image to PDF with scaling and centered
        pdf.addImage(imgData, "PNG", xPos, 0, scaledWidth, scaledHeight);
        pdf.save("PFResult.pdf");
    
        // Restore the hidden elements
        elementsToHide.forEach(element => {
            if (element instanceof HTMLElement) {
                element.style.display = ""; // Restore the element
            }
        });
    };
    
    
    
    
    
    return (
        <div className={styles.container} id="result-container">
            <h2 className={styles.heading}>
                {results.firstName} {results.lastName}
            </h2>
    
            <h3 className={styles.subheading}>Personality Test Result</h3>
            <div className={styles.chartContainer}>
                <Line data={chartData} options={chartOptions} />
            </div>
    
            <div className={styles.resultTable}>
                <table>
                    <thead>
                        <tr>
                            <th>Factors</th>
                            <th>Result Interpretations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedScoring.map((score) => {
                            const { leftMeaning, rightMeaning } = getFactorDescription(score.factorLetter);
                            const stenScore = calculateStenScore(score.rawScore, score.factorLetter);

                            let interpretation: React.ReactNode = "";

                            if (stenScore >= 1 && stenScore <= 3) {
                                interpretation = <span className={styles.leftMeaning}>{leftMeaning}</span>;
                            } else if (stenScore >= 4 && stenScore <= 7) {
                                interpretation = (
                                    <>
                                        <span className={styles.average}> (Average) <br/> </span> 
                                        <span className={styles.leftMeaning}>{leftMeaning} <br/></span> 
                                        <span className={styles.rightMeaning}>{rightMeaning}</span>
                                    </>
                                );
                            } else if (stenScore >= 8 && stenScore <= 10) {
                                interpretation = <span className={styles.rightMeaning}>{rightMeaning}</span>;
                            }
                            return (
                                <tr key={score.factorLetter}>
                                    <td>{factorDescriptions[score.factorLetter]}</td> {/* Use description */}
                                    <td>{interpretation}</td>
                                </tr>
                            );
                        })}
                    </tbody>

                </table>
            </div>

            
    
            <div className={styles.sharePrompt}>
                <p>Would you like to be consulted about your result with our guidance counselor?</p>
                
                <label>
                    <input 
                        type="checkbox" 
                        checked={isChecked} 
                        onChange={(e) => setIsChecked(e.target.checked)} 
                    />
                    I hereby agree to share my results with the guidance counselor.
                </label>
                
                <div className={styles.buttons}>
                    <button onClick={handleShareResult} className={styles.buttonYes}>
                        Yes
                    </button>
                    <button onClick={handleCancel} className={styles.buttonCancel}>
                        No
                    </button>
                </div>
                <button onClick={generatePDF} className={styles.pdfButton}>
                    Save as PDF
                </button>

            </div>
        </div>
    );
};

export default PFResult;