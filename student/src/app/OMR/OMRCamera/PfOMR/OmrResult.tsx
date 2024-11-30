import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './OmrResult.module.scss';
import axios from 'axios';

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

    useEffect(() => {
        // Fetch userID and scores from localStorage
        const storedUserID = localStorage.getItem('userId');
        const storedScores = localStorage.getItem('omrScore'); // Assuming scores are stored in JSON format

        if (storedUserID) {
            setUserID(storedUserID);
        }

        if (storedScores) {
            setSectionScores(JSON.parse(storedScores)); // Parse the stored scores into an object
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
            section: parseInt(section), // Ensure section is a number
            testID: `test-${Date.now()}`,  // Generate a unique testID or let the backend handle it
            scoring: Scoring, // Submit the scoring data
            testType,
            testDate: new Date(), // Current date and time
        };

        try {
            await axios.post('http://localhost:5000/api/omr16pf', dataToSubmit);
            alert('Test submitted successfully!');
            localStorage.setItem('pfTestResults', JSON.stringify(dataToSubmit));
            navigate('/pf-results');
        } catch (error) {
            console.error('Error submitting answers:', error);
            alert('An error occurred while submitting the test.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={style.formTest}>
            <h1>OMR Personality Test Result</h1>
            
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

            {/* Display Section Scores */}
            {Object.keys(sectionScores).length > 0 && (
                <div>
                    <h3>Section Scores:</h3>
                    <ul>
                        {Object.entries(sectionScores).map(([section, score]) => (
                            <li key={section}>
                                <strong>{section}:</strong> {score}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <button className={style.start} type="submit">Submit and View Interpretation</button>
        </form>
    );
};

export default OmrResult;
