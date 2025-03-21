/*The OmrResult initializes and manages various user details such as name, age, etc..., while also retrieving stored
 OMR scores and an uploaded image URL from localStorage. Users input their details, and the component formats the 
 data—including the scores and uploaded image URL—into a structure suitable for backend submission. On form submission,
it sends this data to a backend API endpoint (/api/omr16pf) via a POST request using Axios. The component also handles 
error states, stores the results locally for later use, and navigates to a results page upon successful submission. 
It ensures a streamlined process for capturing and transmitting test data while providing user feedback. */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './OmrResult.module.scss';
import axios from 'axios';
import backendUrl from '../../../../config';

const OmrResult: React.FC = () => {
    const navigate = useNavigate();
    const [userID, setUserID] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const [course, setCourse] = useState<string>('');
    const [year, setYear] = useState<string>('');
    const [section, setSection] = useState<string>('');
    const [sex, setSex] = useState<'Male' | 'Female' | ''>('');
    const [testType, setTestType] = useState<'Online' | 'Physical' | ''>('');
    const [sectionScores, setSectionScores] = useState<{ [key: string]: number }>({}); // Section scores state
    const [uploadURL, setUploadURL] = useState<string>('');

    useEffect(() => {
                // Set viewport for zoom-out effect
                const metaViewport = document.querySelector('meta[name="viewport"]');
                if (metaViewport) {
                  metaViewport.setAttribute("content", "width=device-width, initial-scale=0.8, maximum-scale=1.0");
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

    useEffect(() => {
        // Fetch userID and scores from localStorage
        const storedUserID = localStorage.getItem('userId');
        const storedScores = localStorage.getItem('omrScore'); // Assuming scores are stored in JSON format
        const storedUploadURL = localStorage.getItem('uploadedImageURL'); // Assuming the URL is stored with key 'uploadURL'


        if (storedUserID) {
            setUserID(storedUserID);
        }

        if (storedScores) {
            setSectionScores(JSON.parse(storedScores)); // Parse the stored scores into an object
        }

        if (storedUploadURL) {
            setUploadURL(storedUploadURL);
        }
    }, []);

    // Handle the form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Map sectionScores to the format expected by the backend (factorLetter and rawScore)
        const Scoring = Object.entries(sectionScores).map(([section, score]) => ({
            factorLetter: section, // The section is the factorLetter
            rawScore: score, // The score is the rawScore
        }));

        // Prepare the user data to be submitted, matching the schema
        const dataToSubmit = {
            userID,
            firstName,
            lastName,
            age: parseInt(age), // Ensure age is a number
            sex,
            course,
            year: parseInt(year), // Ensure year is a number
            section, // Ensure section is a number
            testID: `test-${Date.now()}`,  // Generate a unique testID or let the backend handle it
            scoring: Scoring, // Submit the scoring data
            testType,
            testDate: new Date(), // Current date and time
            uploadURL

        };

        try {
            await axios.post(`${backendUrl}/api/omr16pf`, dataToSubmit);
            alert('Test submitted successfully!');
            localStorage.setItem('pfTestResults', JSON.stringify(dataToSubmit));
            navigate('/pf-results');
        } catch (error) {
            console.error('Error submitting answers:', error);
            alert('An error occurred while submitting the test.');
        }
    };

    return (
        <div className={style.formContainer}>
        <form onSubmit={handleSubmit} className={style.formTest}>
            <h1 className= {style.FormTitle}>OMR Personality Test Result</h1>
            
            <input type="text" placeholder="User ID" value={userID} onChange={(e) => setUserID(e.target.value)} required readOnly />
            <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} required />
            <select value={sex} onChange={(e) => setSex(e.target.value as 'Male' | 'Female')} required>
                <option value="" disabled>Select Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </select>
            <select value={course} onChange={(e) => setCourse(e.target.value)} required>
                <option value="" disabled>Select Course</option>
                <option value="Educ">Bachelor of Secondary Education</option>
                        <option value="BM">BS Business Management</option>
                        <option value="CS">BS Computer Science</option>
                        <option value="Crim">BS Criminology</option>
                        <option value="HM">BS Hospitality Management</option>
                        <option value="IT">BS Information Technology</option>
                        <option value="psych">BS Psychology</option>
            </select>
            <select value={year} onChange={(e) => setYear(e.target.value)} required>
                <option value="" disabled>Select Year</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </select>
            <select value={section} onChange={(e) => setSection(e.target.value)} required>
                <option value="" disabled>Select Section</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="Irregular">Irregular</option>
            </select>
            <select value={testType} onChange={(e) => setTestType(e.target.value as 'Online' | 'Physical')} required>
                <option value="" disabled>Select Exam Type</option>
                <option value="Physical">Physical</option>
            </select>

           

            <button className={style.start} type="submit">Submit and View Interpretation</button>
        </form>
        </div>
    );
};

export default OmrResult;
