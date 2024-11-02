import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './page.module.scss'; // Ensure this matches your actual file extension

interface Choice {
    a: string;
    b: string;
    c: string;
}

interface Question {
    questionID: string;
    questionNum: number;
    questionText: string;
    choices: Choice;
    choiceEquivalentScore: { [key: string]: number }; // Corrected type for dynamic keys
}

interface Test {
    testID: string;
    nameofTest: string;
    numOfQuestions: number;
    question: Question[];
}

const PFTest: React.FC = () => {
    const [test, setTest] = useState<Test | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [responses, setResponses] = useState<Record<string, string>>({});

    const [userID, setUserID] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const [sex, setSex] = useState<'Male' | 'Female'>('Male');
    const [courseSection, setCourseSection] = useState<string>('');
    const [testType, setTestType] = useState<'Online' | 'Physical'>('Online');

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
        fetchTest();
    }, []);

    const handleChange = (questionID: string, value: string) => {
        setResponses((prevResponses) => ({ ...prevResponses, [questionID]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formattedResponses = Object.entries(responses).map(([questionID, selectedChoice]) => {
            const question = test?.question.find((q) => q.questionID === questionID);
            const equivalentScore = question?.choiceEquivalentScore[selectedChoice] || 0; // Safely handle undefined

            return {
                questionID,
                selectedChoice,
                equivalentScore,
            };
        });

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
            const response = await axios.post('http://localhost:5000/api/user16pf', dataToSubmit);
            console.log('Test submitted successfully:', response.data);
            alert('Test submitted successfully!');
        } catch (error) {
            console.error('Error submitting answers:', error);
            alert('An error occurred while submitting the test.');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
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
                {test?.question.map((q) => (
                    <div className={styles.questionBox} key={q.questionID}>
                        <p>{q.questionText}</p>
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
                ))}
            </div>
            <button type="submit">Submit Answers</button>
        </form>
    );
};

export default PFTest;
