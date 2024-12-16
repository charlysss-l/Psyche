import React, { useEffect, useState } from 'react';
import styles from './IQResult.module.scss';
import { useNavigate } from 'react-router-dom';
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from 'html2canvas';
import backendUrl from '../../../config';


const DiscoverUlogo = require('../../../images/DiscoverUlogo.png');


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
    testDate: string;
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

// Format the testDate in the desired format (e.g., "December 16, 2024")
const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
};


    useEffect(() => {
        const storedResults = localStorage.getItem('iqTestResults');
        if (storedResults) {
            const parsedResults: IQTestResultData = JSON.parse(storedResults);
            setResult(parsedResults);

            // Fetch the IQ test data based on the test ID to retrieve interpretations
            fetch(`${backendUrl}/api/IQtest/67277ea7aacfc314004dca20`)
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

    

    const generatePDF = () => {
        if (!result || !interpretation) {
            alert("No result data available to generate the PDF.");
            return;
        }
    
        const pdf = new jsPDF();
    
        // Add a title
        pdf.setFontSize(23);
        pdf.setFont( "bold"); // Make the title bold
        pdf.text("Raven's Standard Progressive Matrices", 105, 20, { align: "center" });
        pdf.text("( IQ Test Result )", 105, 33, { align: "center" });

    
        // Add user details in a table
        const userDetails = [
            ["Name", `${result.firstName} ${result.lastName}`],
            ["User ID", result.userID],
            ["Age", result.age],
            ["Sex", result.sex],
            ["Course", result.course],
            ["Year and Section", `${result.year} - ${result.section}`],
            ["Date", formatDate(result.testDate)],
            ["Test Type", result.testType],
        ];
    
        pdf.autoTable({
            startY: 42,
            head: [["Field", "Details"]],
            body: userDetails,
            headStyles: {
                // fillColor: [0, 102, 204], // Blue color for header rows
                // textColor: [255, 255, 255], // White text for headers
                fontSize: 14,
                fontStyle: "bold",
            },
            bodyStyles: {
                // fillColor: [240, 240, 240], // Gray color for body rows
                fontSize: 12,

            },
        });
    
        // Add test results in a table
        const testResults = [
            ["Total Score", result.totalScore],
            ["Interpretation", interpretation.resultInterpretation],
        ];
    
        pdf.autoTable({
            startY: pdf.lastAutoTable.finalY + 10, // Start below the previous table
            head: [["Field", "Details"]],
            body: testResults,
            headStyles: {
                // fillColor: [0, 102, 204], // Blue color for header rows
                // textColor: [255, 255, 255], // White text for headers
                fontSize: 14,
                fontStyle: "bold",
            },
            bodyStyles: {
                // fillColor: [240, 240, 240], // Gray color for body rows
                fontSize: 12,
            },
        });
    
         // Add a footer with logo
    const footerText = "This result is extracted from our website DiscoverU.";
    const footerY = pdf.internal.pageSize.getHeight() - 10;

    // Add the text
    pdf.setFontSize(12);
    pdf.setTextColor(128, 128, 128); // Gray color
    pdf.text(footerText, 105, footerY, { align: "center" });

    // Add the logo image
    const imgWidth = 15; // Width of the logo
    const imgHeight = 15; // Height of the logo
    const imgX = pdf.internal.pageSize.getWidth() - imgWidth - 45; // Position the logo on the right
    const imgY = footerY - imgHeight / 1.6; // Vertically align with the footer text

    const img = new Image();
    img.src = DiscoverUlogo;
    img.onload = () => {
        pdf.addImage(img, "PNG", imgX, imgY, imgWidth, imgHeight);
        pdf.save("IQResult.pdf"); // Save the PDF after the logo is loaded
    };
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
                        <span className={styles.label}>Date:</span>
                        <span className={styles.value}>{result.testDate ? formatDate(result.testDate) : "N/A"}</span>
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

 <div className={styles.messageContainer}>
        {/* Data Privacy Section */}
        <div className={styles.privacySection}>
    <h1>Data Privacy Act</h1>
    <p>
        Your personal information and test results are protected under the Data Privacy Act of 2012 (Republic Act No. 10173). 
        This ensures that all data collected through this IQ test is handled with the utmost confidentiality and care. 
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
<div className={styles.outro}>
    <h1>Is the Raven IQ Test valid and reliable when completed online?</h1>
    <p>
    The reliability of the test can be maintained when taken online if proper measures 
    are taken to ensure a consistent and standardized testing environment. 
    This includes minimizing distractions, ensuring proper time limits, and providing 
    clear instructions. However, when the test is administered in less controlled settings 
    (e.g., from home or in a non-supervised environment), variability in how test-takers 
    interact with the test can introduce measurement errors, potentially affecting reliability. 
    Additionally, the lack of a proctor may allow for cheating or the use of external resources, 
    which could undermine the consistency of results.
    </p>
    <p>
    The validity of the SPM, in terms of accurately measuring fluid intelligence, can still be 
    preserved when administered online if the test interface is designed to replicate the physical 
    version as closely as possible. Issues such as screen size, resolution, or technical problems 
    (e.g., slow loading times) could introduce errors or distract the test-taker, potentially 
    compromising the test's ability to measure the intended cognitive skills.
    </p>
    
    <p>
        {/* References: <a href="https://people.wku.edu/richard.miller/520%2016PF%20Cattell%20and%20Mead.pdf" target="_blank" rel="noopener noreferrer">
            https://people.wku.edu/richard.miller/520%2016PF%20Cattell%20and%20Mead.pdf
        </a> */}
    </p>
</div>
</div>

</div>
    );
};

export default IQResult;
