import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './page.module.scss'; // Ensure this matches your actual file extension
import { Test } from '../../../types/pfTestTypes'; 

// Define the main functional component for the test
const PFTest: React.FC = () => {
    // State that holds test data
    const [test, setTest] = useState<Test | null>(null);
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
            const response = await axios.get<Test>('http://localhost:5000/api/16pf/672201faae0bbcd4fb4c822b');
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

        // Format user responses for submission
        const formattedResponses = Object.entries(responses).map(([questionID, selectedChoice]) => {
            // Find the corresponding question
            const question = test?.question.find((q) => q.questionID === questionID);
            const equivalentScore = question?.choiceEquivalentScore[selectedChoice] || 0;

            return {
                questionID,
                selectedChoice,
                equivalentScore,
            };
        });

        // Prepare data to submit
        const dataToSubmit = {
            userID,
            firstName,
            lastName,
            age,
            sex,
            courseSection,
            testID: test?.testID,
            responses: formattedResponses,
            scoring: [{ rawScore: 0, stenScore: 0 }],
            testType,
        };

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

    //Display loading message while fetching data
    if (loading) return <p>Loading...</p>;
    // Display error message if fetching fails
    if (error) return <p>Error: {error}</p>;

    return (
        <form onSubmit={handleSubmit} className={styles.form}>        {/* Form for test submission */}
            <h1>{test?.nameofTest}</h1>
            <p>Number of Questions: {test?.numOfQuestions}</p>

            {/* User Info Fields */}
            <div>
                <label>
                    User ID:
                    <input type="text" value={userID} onChange={(e) => setUserID(e.target.value)} required />
                </label>
            </div>
            <div>
                <label>
                    First Name:
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </label>
            </div>
            <div>
                <label>
                    Last Name:
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </label>
            </div>
            <div>
                <label>
                    Age:
                    <input type="text" value={age} onChange={(e) => setAge(e.target.value)} required />
                </label>
            </div>
            <div>
                <label>
                    Sex:
                    <select value={sex} onChange={(e) => setSex(e.target.value as 'Male' | 'Female')}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Course Section:
                    <input type="text" value={courseSection} onChange={(e) => setCourseSection(e.target.value)} required />
                </label>
            </div>
            <div>
                <label>
                    Test Type:
                    <select value={testType} onChange={(e) => setTestType(e.target.value as 'Online' | 'Physical')}>
                        <option value="Online">Online</option>
                        <option value="Physical">Physical</option>
                    </select>
                </label>
            </div>

            {/* Questions */}
            <div className={styles.questionContainer}>
                {test?.question.map((q) => ( // Mapping through questions
                    <div className={styles.questionBox} key={q.questionID}> {/* Each question box */}
                        <p>{q.questionText}</p>
                        <div>
                            {Object.entries(q.choices).map(([key, value]) => (
                                <label key={key}>
                                    <input
                                        type="radio"
                                        name={q.questionID}
                                        value={key}
                                        checked={responses[q.questionID] === key} // Check if the choice is selected
                                        onChange={() => handleChange(q.questionID, key)} // Handle choice change
                                    />
                                    {value} {/* Display choice value */}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <button type="submit">Submit Answers</button> {/* Submit button */}
        </form>
    );
};

export default PFTest; 