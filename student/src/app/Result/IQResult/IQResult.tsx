import React, { useEffect, useState } from 'react';
import styles from './IQResult.module.scss';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
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

    

    const generatePDF = async () => {
        // Get the entire result page container
        const resultPage = document.getElementById("result-container");
        if (!resultPage) return;
    
        // Temporarily hide unwanted interactive elements
        const elementsToHide = resultPage.querySelectorAll(
            "button, input[type='checkbox'], label, p"
        );
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
    
        // Generate canvas from the container
        const canvas = await html2canvas(resultPage, { scale: 2 }); // Scale for better quality
        const imgData = canvas.toDataURL("image/png");
    
        // Create PDF document
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
        // Scaling factor (adjust to fit content on one page or scale it)
        const scaleFactor = 0.90;
        const stretchFactor = 1.5; // Control vertical stretching (adjust this to control vertical size)

        const scaledWidth = pdfWidth * scaleFactor;
        const scaledHeight = pdfHeight * stretchFactor;

    
        // Center the content in the PDF
        const xPos = (pdfWidth - scaledWidth) / 2;
    
        // Add the image to the PDF
        pdf.addImage(imgData, "PNG", xPos, 10, scaledWidth, scaledHeight);
    
        // Add the footer message
        const footerText = "This result is extracted from our website DiscoverU";
        <img src={DiscoverUlogo} alt="DiscoverU Logo" className={styles.DiscoverUlogo}/>
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
        pdf.save("IQResult.pdf");
    
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
