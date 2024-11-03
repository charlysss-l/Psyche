import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Question {
    questionID: string;
    questionSet: string;
    questionImage: string;
    choicesImage: string[];
    correctAnswer: string;
}

interface Interpretation {
    ageRange: string;  // e.g., "5-7"
    sex: 'Female' | 'Male';
    minTestScore: number;
    maxTestScore: number;
    percentilePoints: number;
    resultInterpretation: string;
}

interface IQTests {
    testID: string;
    nameOfTest: string;
    numOfQuestions: number;
    questions: Question[];
}

const IQTest: React.FC = () => {
    const [iqTest, setIqTest] = useState<IQTests | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [responses, setResponses] = useState<Record<string, string>>({});

    const [userID, setUserID] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const [sex, setSex] = useState<'Male' | 'Female'>('Male');
    const [testType, setTestType] = useState<'Online' | 'Physical'>('Online');

    const fetchTest = async () => {
        try {
            const response = await axios.get<IQTests>('http://localhost:5000/api/IQtest/672494d99fa35a9eb170ca9b'); // Update with the correct ID
            setIqTest(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTest();
    }, []);

    const handleChange = (questionID: string, value: string) => {
        setResponses((prevResponses) => ({ ...prevResponses, [questionID]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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
            const response = await axios.post('http://localhost:5000/api/userIqTest', dataToSubmit);
            console.log("Test submitted successfully:", response.data);
            alert('Test submitted successfully!');
        } catch (error) {
            console.error("Error submitting answers:", error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
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
            <ul>
                {iqTest?.questions.map((q) => (
                    <li key={q.questionID}>
                        <p>{q.questionSet}</p>
                        <img src={q.questionImage} alt={`Question ${q.questionID}`} />
                        <div>
                            {q.choicesImage.map((choiceImage, index) => (
                                <label key={index}>
                                    <input
                                        type="radio"
                                        name={q.questionID}
                                        value={`choice${index + 1}`} // Assuming you want to keep track of choices by index
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
    );
};

export default IQTest;
