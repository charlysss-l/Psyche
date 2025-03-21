import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './studentpfresult.module.scss';
import { useNavigate } from 'react-router-dom';
import backendUrl from '../../../config';
import axios from 'axios';
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
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Import the jsPDF autotable plugin
import html2canvas from 'html2canvas';

const DiscoverUlogo = require('../../../images/DiscoverUlogo.png');



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
    testDate: string;
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
    const [dataTitle, setDataTitle] = useState<string>(''); // State for intro title
    const [outroTitle, setOutroTitle] = useState<string>(''); // State for terms and conditions title
    const [dataText, setDataText] = useState<string>(''); // State for intro text
    const [outroText, setOutroText] = useState<string>(''); // State for terms and conditions text
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state
    const factorOrder = ['A', 'B', 'C', 'E', 'F', 'G', 'H', 'I', 'L', 'M', 'N', 'O', 'Q1', 'Q2', 'Q3', 'Q4'];

         useEffect(() => {
                // Set viewport for zoom-out effect
                const metaViewport = document.querySelector('meta[name="viewport"]');
                if (metaViewport) {
                  metaViewport.setAttribute("content", "width=device-width, initial-scale=0.6, maximum-scale=1.0");
                } else {
                  const newMeta = document.createElement("meta");
                  newMeta.name = "viewport";
                  newMeta.content = "width=device-width, initial-scale=0.8, maximum-scale=1.0, user-scalable=no";
                  document.head.appendChild(newMeta);
                }
            
                // Cleanup function to reset viewport when leaving the page
                return () => {
                  if (metaViewport) {
                    metaViewport.setAttribute("content", "width=device-width, initial-scale=1.0");
                  }
                };
              }, []);

      // Fetch content from the database
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${backendUrl}/api/textDisplay/contents/PF`)
      .then((response) => {
        const dataContent = response.data.find((content: any) => content.key === 'data_privacyPF');
        const outroContent = response.data.find((content: any) => content.key === 'outroPF');

        if (dataContent) setDataText(dataContent.text);
        if (outroContent) setOutroText(outroContent.text);
        if (dataContent) setDataTitle(dataContent.title);
        if (outroContent) setOutroTitle(outroContent.title);
      })
      .catch((err) => {
        setError('Failed to fetch content. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
            const response = await fetch(`${backendUrl}/api/user16pf`, {
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
                label: '                           Low (1, 2, 3)                            Average (4, 5, 6, 7)                       High (8, 9, 10)', 
                data: sortedScoring.map((score) =>
                    calculateStenScore(score.rawScore, score.factorLetter)
                ), // Calculate sten scores dynamically
                borderColor: 'rgba(75, 192, 192, 1)', // Line color
                backgroundColor: 'violet', // Fill color
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
                    text: 'Score',
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
        // Get the entire result page container
        const resultPage = document.getElementById("result-container");
        if (!resultPage) return;
    
        // Temporarily hide unwanted interactive elements
        const elementsToHide = resultPage.querySelectorAll("button, input[type='checkbox'], label, p");
        elementsToHide.forEach((element) => {
            if (element instanceof HTMLElement) {
                element.style.display = "none"; // Hide interactive elements
            }
        });
    
        // Temporarily adjust layout if needed
        const originalStyles: Record<string, string> = {};
        const adjustElements = resultPage.querySelectorAll(".outro, .privacySection");
        adjustElements.forEach((element) => {
            if (element instanceof HTMLElement) {
                originalStyles[element.className] = element.style.margin || ""; // Save original styles
                element.style.margin = "10px 0"; // Adjust margins for PDF layout
            }
        });
    
        // Prepare the user information text for the table
        const userInfo = [
            { label: "User ID", value: `${results.userID}` },
            { label: "Name", value: `${results.firstName} ${results.lastName}` },
            { label: "Age", value: `${results.age}` },
            { label: "Sex", value: `${results.sex}` },
            { label: "Course", value: `${results.course}` },
            { label: "Year & Section", value: `${results.year} - ${results.section}` },
            { 
                label: "Date Taken", 
                value: new Date(results.testDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }) 
            },
        ];
    
        // Prepare the scoring interpretation text for the table
        const scoringData = sortedScoring.map((score) => {
            const { leftMeaning, rightMeaning } = getFactorDescription(score.factorLetter);
            const stenScore = calculateStenScore(score.rawScore, score.factorLetter);
    
            let interpretation = "";
            if (stenScore >= 1 && stenScore <= 3) {
                interpretation = `${leftMeaning}`;
            } else if (stenScore >= 4 && stenScore <= 7) {
                interpretation = `(Average) ${leftMeaning} / ${rightMeaning}`;
            } else if (stenScore >= 8 && stenScore <= 10) {
                interpretation = `${rightMeaning}`;
            }
    
            return { factor: score.factorLetter, interpretation };
        });
    
        // Generate canvas from the chart container
        const canvas = await html2canvas(resultPage, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
    
        // Set cropping margins (adjust these values as needed)
        const cropTop = 450; // Crop 50px from the top
        const cropBottom = 2570; // Crop 50px from the bottom
        const cropLeft = 120; // Crop 50px from the left
        const cropRight = 120; // Crop 50px from the right
    
        // Create a new cropped canvas
        const croppedCanvas = document.createElement("canvas");
        const croppedContext = croppedCanvas.getContext("2d");
    
        if (croppedContext) {
            // Set the new canvas width and height based on the cropped area
            croppedCanvas.width = canvas.width - cropLeft - cropRight;
            croppedCanvas.height = canvas.height - cropTop - cropBottom;
    
            // Draw the cropped portion of the original canvas onto the new canvas
            croppedContext.drawImage(
                canvas,
                cropLeft, cropTop, // Starting point for cropping (from top-left)
                canvas.width - cropLeft - cropRight, // Width to draw
                canvas.height - cropTop - cropBottom, // Height to draw
                0, 0, // Place the cropped image at the top-left corner of the new canvas
                croppedCanvas.width, croppedCanvas.height // Width and height of the new canvas
            );
        }
    
        // Get the cropped image data URL
        const croppedImgData = croppedCanvas.toDataURL("image/png");
    
        // Create PDF document
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
        // Scaling factor for better fit
        const scaleFactor = 0.165;
        const stretchedWidth = .90;
        const scaledWidth = pdfWidth * stretchedWidth;
        const scaledHeight = pdfHeight * scaleFactor;
    
        // Add the title at the top center
        pdf.setFontSize(16);
        const title = "16PF Fifth Edition Individual Record Form";
        const titleX = pdfWidth / 2 - pdf.getTextWidth(title) / 2;
        pdf.text(title, titleX, 15); // 15mm from the top
    
        // Add the user information as a table
        pdf.autoTable({
            head: [["Field", "Value"]],
            body: userInfo.map(info => [info.label, info.value]),
            startY: 20, // Adjust startY to accommodate the title
            theme: 'grid',
            margin: { top: 10, left: 10, right: 10 },
            styles: { fontSize: 10 },
            headStyles: { fillColor: [100, 61, 133] } // RGB for blue
        });
    
        // Add the chart image below the table
        const xPos = (pdfWidth - scaledWidth) / 2;
        pdf.addImage(croppedImgData, "PNG", xPos, pdf.lastAutoTable.finalY + 1, scaledWidth, scaledHeight);
    
        // Add the scoring interpretation as a table
        pdf.autoTable({
            head: [["Factor", "Interpretation"]],
            body: scoringData.map(data => [factorDescriptions[data.factor], data.interpretation]),
            startY: pdf.lastAutoTable.finalY + 75,
            theme: 'grid',
            margin: { top: 10, left: 10, right: 10 },
            styles: { fontSize: 9 },
            headStyles: { fillColor: [100, 61, 133] }
        });
    
        // Add the footer message
        const footerText = "This result is extracted from our website DiscoverU";
        const footerFontSize = 10; // Adjust font size as needed
        pdf.setFontSize(footerFontSize);
    
        // Set text color to gray
        pdf.setTextColor(128, 128, 128); // RGB values for gray
        const footerYPos = pdf.internal.pageSize.getHeight() - 10; // Position 10mm from the bottom
    
        const footerLogoXPos = (pdfWidth / 2) + 32; // Adjust horizontal position for logo
        const footerLogoYPos = footerYPos - 2;
        const footerTextXPos = (pdfWidth / 2) - 10; // Position text slightly to the right of the logo
    
        // Add the logo
        const logo = await fetch(DiscoverUlogo).then((res) => res.blob());
        const logoUrl = URL.createObjectURL(logo);
        pdf.addImage(logoUrl, "PNG", footerLogoXPos, footerLogoYPos - 5, 10, 10); // Add logo (10mm size)
    
        pdf.text(footerText, footerTextXPos, footerYPos, { align: "center" });
    
        // Save the PDF
        pdf.save("PFResult.pdf");
    
        // Restore hidden elements
        elementsToHide.forEach((element) => {
            if (element instanceof HTMLElement) {
                element.style.display = ""; // Restore the display property
            }
        });
    
        // Restore adjusted styles
        adjustElements.forEach((element) => {
            if (element instanceof HTMLElement) {
                element.style.margin = originalStyles[element.className]; // Restore original margins
            }
        });
    };
    
    
    return (
    <div className={styles.resultPage}>
        <div className={styles.container} id="result-container">
            <h2 className={styles.heading}>
                {results.firstName} {results.lastName}
            </h2>
    
            <h3 className={styles.subheading}>16PF Fifth Edition Individual Record Form</h3>
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
<div className={styles.messageContainer}>
        {/* Data Privacy Section */}
        <div className={styles.privacySection}>
        <h1 className={styles.pfintro}>{dataTitle}</h1>
        <p className={styles.pfintroinfo}>
        {dataText.split('\n').map((line, index) => (
            <React.Fragment key={index}>
            {line.split(/(https?:\/\/[^\s]+)/).map((part, idx) => (
          // Check if the part is a URL
          /https?:\/\/[^\s]+/.test(part) ? (
            <a
              key={idx}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link} // Optional: Style the link
            >
              {part}
            </a>
          ) : (
            part
          )
        ))}
        <br />
            </React.Fragment>
        ))}
        </p>
</div>
<div className={styles.outro}>
  <h1 className={styles.termsandconditionpf}>{outroTitle}</h1>
  <p className={styles.pfintroinfo}>
    {outroText.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line.split(/(https?:\/\/[^\s]+)/).map((part, idx) => (
          // Check if the part is a URL
          /https?:\/\/[^\s]+/.test(part) ? (
            <a
              key={idx}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link} // Optional: Style the link
            >
              {part}
            </a>
          ) : (
            part
          )
        ))}
        <br />
      </React.Fragment>
    ))}
  </p>
</div>

</div>


    </div>
    );
};

export default PFResult;