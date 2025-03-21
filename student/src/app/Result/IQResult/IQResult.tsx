import React, { useEffect, useState } from 'react';
import styles from './IQResult.module.scss';
import { useNavigate } from 'react-router-dom';
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from 'axios';
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
    const [dataTitle, setDataTitle] = useState<string>(''); // State for intro title
    const [outroTitle, setOutroTitle] = useState<string>(''); // State for terms and conditions title
    const [dataText, setDataText] = useState<string>(''); // State for intro text
    const [outroText, setOutroText] = useState<string>(''); // State for terms and conditions text
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state


                useEffect(() => {
                      // Set viewport for zoom-out effect
                      const metaViewport = document.querySelector('meta[name="viewport"]');
                      if (metaViewport) {
                        metaViewport.setAttribute("content", "width=device-width, initial-scale=0.7, maximum-scale=1.0");
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
      .get(`${backendUrl}/api/textDisplay/contents/IQ`)
      .then((response) => {
        const dataContent = response.data.find((content: any) => content.key === 'data_privacyIQ');
        const outroContent = response.data.find((content: any) => content.key === 'outroIQ');

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
        pdf.setFontSize(20);
        pdf.setFont("helvetica"); // Make the title bold
        pdf.text("Raven's Standard Progressive Matrices", 105, 20, { align: "center" });
    
        pdf.setFontSize(16);
        pdf.text("( IQ Test Individual Record Form )", 105, 30, { align: "center" });
    
        // Add user details in a table with grid lines
        const userDetails = [
            ["User ID", result.userID],
            ["Name", `${result.firstName} ${result.lastName}`],
            ["Age", result.age],
            ["Sex", result.sex],
            ["Course", result.course],
            ["Year and Section", `${result.year} - ${result.section}`],
            ["Date", formatDate(result.testDate)],
        ];
    
        pdf.autoTable({
            startY: 40,
            head: [["Field", "Details"]],
            body: userDetails,
            headStyles: {
                fontSize: 14,
                fontStyle: "bold",
                fillColor: [100, 61, 133],
            },
            bodyStyles: {
                fillColor: [255, 255, 255], 
                fontSize: 12,
            },
            theme: "grid", // Add grid lines to the table
        });
    
        // Add test results in a table with grid lines
        const testResults = [
            ["Total Score", result.totalScore],
            ["Interpretation", interpretation.resultInterpretation],
        ];
    
        pdf.autoTable({
            startY: pdf.lastAutoTable.finalY + 10, // Start below the previous table
            head: [["Field", "Details"]],
            body: testResults,
            headStyles: {
                fontSize: 14,
                fontStyle: "bold",
                fillColor: [100, 61, 133],
            },
            bodyStyles: {
                fontSize: 12,
            },
            theme: "grid", // Add grid lines to the table
        });
    
        // Add a footer with logo
        const footerText = "This result is extracted from our website DiscoverU";
        const footerY = pdf.internal.pageSize.getHeight() - 10;
    
        // Add the text
        pdf.setFontSize(10);
        pdf.setTextColor(128, 128, 128); // Gray color
        pdf.text(footerText, 95, footerY, { align: "center" });
    
        // Add the logo image
        const imgWidth = 10; // Width of the logo
        const imgHeight = 10; // Height of the logo
        const imgX = pdf.internal.pageSize.getWidth() - imgWidth - 63; // Position the logo on the right
        const imgY = footerY - imgHeight / 1.43; // Vertically align with the footer text
    
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

export default IQResult;
