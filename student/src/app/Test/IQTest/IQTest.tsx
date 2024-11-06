import React, { useEffect, useState } from 'react';
import axios from 'axios';
import style from './studentiqtest.module.scss';

// Define the Question interface, representing each question's structure in the IQ test
interface Question {
    questionID: string;
    questionSet: string;
    questionImage: string;
    choicesImage: string[];
    correctAnswer: string;
}

// Define the Interpretation interface, for result interpretation based on age, sex, and score range
interface Interpretation {
    ageRange: string;  // e.g., "5-7"
    sex: 'Female' | 'Male';
    minTestScore: number;
    maxTestScore: number;
    percentilePoints: number;
    resultInterpretation: string;
}

// Define the IQTests interface, representing the structure of an IQ test
interface IQTests {
    testID: string;
    nameOfTest: string;
    numOfQuestions: number;
    questions: Question[];
}

// Functional component for rendering the IQ Test form
const IQTest: React.FC = () => {
    // State to hold the IQ test data
    const [iqTest, setIqTest] = useState<IQTests | null>(null);
    // State to track loading status
    const [loading, setLoading] = useState<boolean>(true);
    // State to handle and display errors
    const [error, setError] = useState<string | null>(null);
    // State to store user responses to each question
    const [responses, setResponses] = useState<Record<string, string>>({});

    // User information states
    const [userID, setUserID] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const [sex, setSex] = useState<'Male' | 'Female'>('Male');
    const [testType, setTestType] = useState<'Online' | 'Physical'>('Online');

    // Fetch IQ test data from the server
    const fetchTest = async () => {
        try {
            // API request to get test data by a specific test ID
            const response = await axios.get<IQTests>('http://localhost:5000/api/IQtest/67277ea7aacfc314004dca20'); // Replace with the correct ID
            setIqTest(response.data); // Set test data to state
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred'); // Handle any error
        } finally {
            setLoading(false); // Set loading to false once done
        }
    };

    // useEffect hook to fetch test data when the component mounts
    useEffect(() => {
        fetchTest();
    }, []);

    // Function to update responses for each question when the user selects an option
    const handleChange = (questionID: string, value: string) => {
        setResponses((prevResponses) => ({ ...prevResponses, [questionID]: value }));
    };

    // Function to handle form submission, including posting data to the server
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission

        // Collect data to submit, including user details and responses
        const dataToSubmit = {
            userID,
            firstName,
            lastName,
            age,
            sex,
            testID: iqTest?.testID,
            responses,
            testType,
        };

        try {
            // Post data to the server endpoint
            const response = await axios.post('http://localhost:5000/api/userIqTest', dataToSubmit);
            console.log("Test submitted successfully:", response.data);
            alert('Test submitted successfully!'); // Alert user on success
        } catch (error) {
            console.error("Error submitting answers:", error); // Log error if submission fails
        }
    };

    // Show loading or error message based on current state
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={style.container}>

        <form onSubmit={handleSubmit}>
            <h1>{iqTest?.nameOfTest}</h1>
            <p>Number of Questions: {iqTest?.numOfQuestions}</p>

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
                    Test Type:
                    <select value={testType} onChange={(e) => setTestType(e.target.value as 'Online' | 'Physical')}>
                        <option value="Online">Online</option>
                        <option value="Physical">Physical</option>
                    </select>
                </label>
            </div>

            {/* Questions */}
            <ul className= {style.questions}>
                {iqTest?.questions.map((q) => (
                    <li key={q.questionID}>
                        <div className={style['question-image']}>
                            <p>{q.questionSet}</p>
                            <img src={q.questionImage} alt={`Question ${q.questionID}`} />
                        </div>
                        <div className={style.choices}>
                            {q.choicesImage.map((choiceImage, index) => (
                                <label key={index}>
                                    <input
                                        type="radio"
                                        name={q.questionID}
                                        value={`choice${index + 1}`} // Using the index to track choices
                                        checked={responses[q.questionID] === `choice${index + 1}`}
                                        onChange={() => handleChange(q.questionID, `choice${index + 1}`)}
                                    />
                                    <img src={choiceImage} alt={`Choice ${index + 1}`} />
                                </label>
                            ))}
                        </div>
                    </li>
                ))}
            </ul>

            <button type="submit">Submit Answers</button>
        </form>
        </div>

    );
};

export default IQTest;
