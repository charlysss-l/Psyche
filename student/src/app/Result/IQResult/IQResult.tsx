import React, { useEffect, useState } from 'react';
import styles from './IQResult.module.scss';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
    const [isChecked, setIsChecked] = useState(false); // Track checkbox state


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
        if (!isChecked) {
            alert("Please agree to share your results by checking the box.");
            return;
        }

        const userConfirmed = window.confirm(
            "Are you sure you want to be consulted and share your result with the guidance counselor?"
        );
        
        if (userConfirmed) {
            navigate('/consultation');
            alert('Please Fill the Consultation Form to schedule a consultation with our Guidance Councelor.');

        } else {
            alert("Result sharing cancelled. Your Result has been saved to your Result Page.");
            navigate('/home');

        }
    };

    const handleCancel = () => {
        alert('Result sharing cancelled. Your Result has been saved to your Result Page.');
        navigate('/home');
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
        const pdfHeight = pdf.internal.pageSize.getHeight();
    
        // Define scaling factors
        const scaleFactor = 0.9; // Control zoom level (adjust for width scaling)
        const stretchFactor = 0.8; // Control vertical stretching (adjust this to control vertical size)
    
        // Calculate the scaled width based on the scale factor
        const scaledWidth = pdfWidth * scaleFactor;
    
        // Calculate the scaled height based on the stretch factor
        const scaledHeight = pdfHeight * stretchFactor;
    
        // Calculate the X position to center the image
        const xPos = (pdfWidth - scaledWidth) / 2;
    
        // Add a margin (for example, 10 mm from the top)
        const marginTop = 20;  // Adjust the margin value as needed
    
        // Add image to PDF with scaling, centered, and a top margin
        pdf.addImage(imgData, "PNG", xPos, marginTop, scaledWidth, scaledHeight);
        pdf.save("IQResult.pdf");
    
        // Restore the hidden elements
        elementsToHide.forEach(element => {
            if (element instanceof HTMLElement) {
                element.style.display = ""; // Restore the element
            }
        });
    };
    
    
    

    return (
    <div className={styles.resultPage}>

        <div className={styles.container} id="result-container">
            {result ? (
                <div>
                    <h2 className={styles.header}>{result.firstName} {result.lastName}</h2>
                    <h3 className={styles.subheading}>IQ Test Result</h3>

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
                        <h3>Total Score: <span className={styles.score}>{result.totalScore}</span> </h3>
                        <h3>Interpretation: <span className={styles.interpretation}>
                        {interpretation ? interpretation.resultInterpretation : "Interpretation not available."}
                    </span></h3>
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
            ) : (
                <p className={styles.noResults}>No results available. Please complete the test.</p>
            )}
        </div>

        {/* Data Privacy Section */}
        <div className={styles.privacySection}>
    <h1>Data Privacy Act</h1>
    <p>
        Your personal information and test results are protected under the Data Privacy Act of 2012 (Republic Act No. 10173). 
        This ensures that all data collected through this personality test is handled with the utmost confidentiality and care. 
        The information provided will be used exclusively for assessment and consultation purposes within the psychology department.
    </p>
    <p>
        The results of your test are securely stored on the psychology department’s servers, accessible only to authorized personnel. 
        You have full control over how your results are shared. If you decide to consult with our guidance counselor, your results 
        can be accessed by them to provide personalized advice and assistance. Rest assured, no data will be shared with third parties 
        without your explicit consent.
    </p>
    <p>
        We prioritize your privacy and comply with all applicable laws and regulations regarding data protection. If you have any concerns 
        or require further information on how we handle your data, you may reach out to our psychology department or refer to our privacy policy.
    </p>
</div>
</div>
    );
};

export default IQResult;
