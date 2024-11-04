import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './page.module.scss'; // Ensure this matches your actual file extension
import { User16PFTest, Question } from '../../../types/pfTestTypes'; // Adjust the import to match your types

// Define the main functional component for the test
const PFTest: React.FC = () => {
    // State that holds test data
    const [test, setTest] = useState<User16PFTest | null>(null);
    // State that manages loading state
    const [loading, setLoading] = useState<boolean>(true);
    // State that manages error messages
    const [error, setError] = useState<string | null>(null);
    // State that tracks user responses to questions
    const [responses, setResponses] = useState<Record<string, string>>({});

    // User info state variables for collecting participant details
    const [userID, setUserID] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const [sex, setSex] = useState<'Male' | 'Female'>('Male');
    const [courseSection, setCourseSection] = useState<string>('');
    const [testType, setTestType] = useState<'Online' | 'Physical'>('Online');

    // Function to fetch test data from the server
    const fetchTest = async () => {
        try {
            const response = await axios.get<User16PFTest>('http://localhost:5000/api/16pf/67282807d9bdba831a7e9063');
            console.log(response.data); // Log the response data to inspect its structure
            setTest(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch test data on component mount
        fetchTest();
    }, []);

    // Function to handle changes in question responses
    const handleChange = (questionID: string, value: string) => {
        // Update responses state with the selected choice
        setResponses((prevResponses) => ({ ...prevResponses, [questionID]: value }));
    };

    // Function to handle form submission
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create a map to accumulate scores by factorLetter
    const scoreMap: Record<string, { rawScore: number; stenScore: number }> = {};

    // Format user responses and accumulate scores for each factorLetter
    const formattedResponses = Object.entries(responses).map(([questionID, selectedChoice]) => {
        const question = test?.question.find((q: Question) => q.questionID === questionID);
        const equivalentScore = question?.choiceEquivalentScore?.[selectedChoice] || 0;
        const factorLetter = question?.factorLetter || '';

        // If the factorLetter is not empty, accumulate the score
        if (factorLetter) {
            if (!scoreMap[factorLetter]) {
                scoreMap[factorLetter] = { rawScore: 0, stenScore: 1 }; // Initialize if not present
            }
            scoreMap[factorLetter].rawScore += equivalentScore;
        }

        return {
            questionID,
            selectedChoice,
            equivalentScore,
            factorLetter,
        };
    });

    // Convert the scoreMap to an array of ScoreEntry objects
    const scoring = Object.entries(scoreMap).map(([factorLetter, { rawScore, stenScore }]) => ({
        factorLetter,
        rawScore,
        stenScore,
    }));

    // Prepare data to submit
    const dataToSubmit = {
        userID,
        firstName,
        lastName,
        age,
        sex,
        courseSection,
        responses: formattedResponses,
        scoring, // Use the newly formatted scoring array
        testType,
    };

    console.log('Data to submit:', dataToSubmit); // Log data being sent to the server

    try {
        // POST request to submit data
        const response = await axios.post('http://localhost:5000/api/user16pf', dataToSubmit);
        console.log('Test submitted successfully:', response.data);
        alert('Test submitted successfully!');
    } catch (error) {
        console.error('Error submitting answers:', error);
        alert('An error occurred while submitting the test.');
    }
};

    // Display loading message while fetching data
    if (loading) return <p>Loading...</p>;
    // Display error message if fetching fails
    if (error) return <p>Error: {error}</p>;

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {/* Form for test submission */}
            <h1>{test?.nameofTest}</h1>
            <p>Number of Questions: {test?.numOfQuestions}</p>
    
            {/* User Info Fields */}
            <div>
                <input type="text" placeholder="User ID" value={userID} onChange={(e) => setUserID(e.target.value)} required />
                <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} required />
                <select value={sex} onChange={(e) => setSex(e.target.value as 'Male' | 'Female')} required>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
                <input type="text" placeholder="Course Section" value={courseSection} onChange={(e) => setCourseSection(e.target.value)} required />
                <select value={testType} onChange={(e) => setTestType(e.target.value as 'Online' | 'Physical')} required>
                    <option value="Online">Online</option>
                    <option value="Physical">Physical</option>
                </select>
            </div>
    
            {/* Questions */}
            <div className={styles.questionContainer}>
                {test?.question && test.question.length > 0 ? (
                    test.question.map((q: Question, index: number) => (
                        <div className={styles.questionBox} key={q.questionID}>
                            {/* Display question number with question text */}
                            <p>{index + 1}. {q.questionText}</p>
                            <div>
                                {Object.entries(q.choices).map(([key, value]) => (
                                    <label key={key}>
                                        <input
                                            type="radio"
                                            name={q.questionID}
                                            value={key}
                                            checked={responses[q.questionID] === key}
                                            onChange={() => handleChange(q.questionID, key)}
                                        />
                                        {value}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No questions available</p>
                )}
            </div>
            <button type="submit">Submit Answers</button>
        </form>
    );
};

export default PFTest;
