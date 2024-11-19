import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './OMRResult.module.scss';

const OMRResult: React.FC = () => {
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
    const [omrScore, setOmrScore] = useState<number | null>(null); // Score state

    useEffect(() => {
        // Fetch userID and score from localStorage
        const storedUserID = localStorage.getItem('userId');
        const storedOmrScore = localStorage.getItem('omrScore'); // Assuming the score is stored with key 'omrScore'

        if (storedUserID) {
            setUserID(storedUserID);
        }

        if (storedOmrScore) {
            setOmrScore(Number(storedOmrScore)); // Ensure it's converted to a number
        }
    }, []);

    // Handle the form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Check if the user is 20 years or older
        if (parseInt(age) < 20) {
            alert("You must be 20 years or older to take this test.");
            return;
        }

        // Convert omrScore to totalScore (assuming a conversion factor or logic here)
        const totalScore = omrScore ? omrScore * 2 : 0;  // Example conversion logic

        // Store the user data in localStorage
        const userDetails = { firstName, lastName, age, course, year, section, sex, testType, totalScore };
        localStorage.setItem('userDetails', JSON.stringify(userDetails));

        // Navigate to the IQ result page
        navigate('/iq-results');
    };

    return (
        <form onSubmit={handleSubmit} className={style.formTest}>
            <h1>OMR Result</h1>
            <p className={style.ageWarning}>
                "You Must Be 20 Years Old and Above To Submit This Form"
            </p>
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
                <option value="BSCS">BSCS</option>
                <option value="BSIT">BSIT</option>
                <option value="BSP">BSP</option>
                <option value="BSCrim">BSCrim</option>
                <option value="BSEd">BSEd</option>
                <option value="BSHRM">BSHRM</option>
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
            </select>
            <select value={testType} onChange={(e) => setTestType(e.target.value as 'Online' | 'Physical')} required>
                <option value="Physical">Physical</option>
            </select>

            {/* Display OMR Score */}
            {omrScore !== null && (
                <div>
                    <h3>Your OMR Score: {omrScore}</h3>
                </div>
            )}

            <button className={style.start} type="submit">Submit and View Interpretation</button>
        </form>
    );
};

export default OMRResult;
