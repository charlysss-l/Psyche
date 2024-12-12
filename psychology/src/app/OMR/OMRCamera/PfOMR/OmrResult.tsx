import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './OmrResult.module.scss';
import axios from 'axios';
import backendUrl from '../../../../config';

const OmrResult: React.FC = () => {
    const navigate = useNavigate();
    const [userID, setUserID] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('N/A');
    const [lastName, setLastName] = useState<string>('N/A');
    const [age, setAge] = useState<number>(0);              
    const [course, setCourse] = useState<string>('N/A');
    const [year, setYear] = useState<number>(0);            
    const [section, setSection] = useState<number>(0); 
    const [sex, setSex] = useState<string>('N/A');             
    const [testType, setTestType] = useState<string>('N/A');   
    const [sectionScores, setSectionScores] = useState<{ [key: string]: number }>({}); // Section scores state
    const [userExists, setUserExists] = useState<boolean>(false);
    const [userFoundMessage, setUserFoundMessage] = useState<string>('');
    const [uploadURL, setUploadURL] = useState<string>('');


    useEffect(() => {
        // Fetch userID and scores from localStorage
        const storedScores = localStorage.getItem('omrScore'); // Assuming scores are stored in JSON format
        const storedUploadURL = localStorage.getItem('uploadedImageURL'); // Assuming the URL is stored with key 'uploadURL'

        
        setUserID('');
        

        if (storedScores) {
            setSectionScores(JSON.parse(storedScores)); // Parse the stored scores into an object
        }
        if (storedUploadURL) {
            setUploadURL(storedUploadURL);
        }
    }, []);

    // Check if the user exists by userID
    const checkUserID = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/authStudents/students/${userID}`);
            if (response.data) {
                setUserExists(true);
                setUserFoundMessage('User ID found!');
                setFirstName(response.data.firstName || 'N/A');
                setLastName(response.data.lastName || 'N/A');
                setAge(response.data.age || 1);
                setCourse(response.data.course || 'N/A');
                setYear(response.data.year || 1);
                setSection(response.data.section || 1);
                setSex(response.data.sex || 'N/A');
                setTestType(response.data.testType || 'Physical');
            }
        } catch (error) {
            console.error('Error checking user ID:', error);
            setUserExists(false);
            setUserFoundMessage('User ID does not exist!');
        }
    };

    // Handle userID input change
    const handleUserIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserID(e.target.value);
        setUserFoundMessage('');
    };

    // Handle the form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if user exists before proceeding
        if (!userExists) {
            alert('User ID does not exist!');
            return;
        }

         // Ensure `age`, `year`, and `section` are set to 0 if they are empty or invalid
         const finalAge = age || 1;
         const finalYear = year || 1;
         const finalSection = section || 1;

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
            age: finalAge, // Ensure age is 0 if not set
            sex,
            course,
            year: finalYear, // Ensure year is 0 if not set
            section: finalSection, // Ensure section is 0 if not set
            testID: 'unique-test-id', // Generate a unique testID or let the backend handle it
            scoring: Scoring, // Submit the scoring data
            testType,
            testDate: new Date(), // Current date and time
            uploadURL
        };

        try {
            await axios.post(`${backendUrl}/api/omr16pf`, dataToSubmit);
            alert('Test submitted successfully!');
            localStorage.setItem('pfTestResults', JSON.stringify(dataToSubmit));
            navigate('/all-pf-test-list');  
        } catch (error) {
            console.error('Error submitting answers:', error);
            alert('An error occurred while submitting the test.');
        }
    };

    useEffect(() => {
        if (userID) {
            checkUserID();
        }
    }, [userID]);

    return (
        <form onSubmit={handleSubmit} className={style.formTest}>
            <h1>OMR Personality Test Result</h1>
            <p className={style.ageWarning}>
                Find UserID and submit it to that User if found
            </p>

            <input
                type="text"
                placeholder="User ID"
                value={userID}
                onChange={handleUserIDChange}
                required
            />

<p style={{ color: userExists ? 'green' : 'red' }}>
                {userFoundMessage}
            </p>
            
            <div className={ style.hidden}>
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Age"
                    value={age || 1} // Ensure it always shows 0 if empty
                    onChange={(e) => setAge(Number(e.target.value))}
                    required
                />
                <input
                    type="text"
                    placeholder="Sex (e.g., Male/Female)"
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Course"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Year"
                    value={year || 1} // Ensure it always shows 0 if empty
                    onChange={(e) => setYear(Number(e.target.value))}
                    required
                />
                <input
                    type="number"
                    placeholder="Section"
                    value={section || 1} // Ensure it always shows 0 if empty
                    onChange={(e) => setSection(Number(e.target.value))}
                    required
                />
                <input
                    type="text"
                    placeholder="Test Type (Online/Physical)"
                    value={testType}
                    onChange={(e) => setTestType(e.target.value)}
                    required
                />
            </div>

           

<button type="submit">Submit</button>
</form>
    );
};

export default OmrResult;
