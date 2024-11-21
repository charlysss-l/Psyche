import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './studentpftest.module.scss';
import { User16PFTest, Question } from '../../../types/pfTestTypes';
import { useNavigate } from 'react-router-dom';

const PFTest: React.FC = () => {
    const [test, setTest] = useState<User16PFTest | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [responses, setResponses] = useState<Record<string, string>>({});
    const [currentPage, setCurrentPage] = useState<number>(1);
    const questionsPerPage = 5; // Number of questions per page
    const navigate = useNavigate();

    const [userID, setUserID] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const [sex, setSex] = useState<'Male' | 'Female' | ''>('');
    const [course, setCourse] = useState<string>('');
    const [year, setYear] = useState<string>('');
    const [section, setSection] = useState<string>('');
    const [testType, setTestType] = useState<'Online' | 'Physical' | ''>('');

    useEffect(() => {
        // Fetch userID from localStorage and set it in state
        const storedUserID = localStorage.getItem('userId');
        if (storedUserID) {
            setUserID(storedUserID);
        }

        fetchTest();
    }, []);

    const fetchTest = async () => {
        try {
            const response = await axios.get<User16PFTest>('http://localhost:5000/api/16pf/67282807d9bdba831a7e9063');
            setTest(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (questionID: string, value: string) => {
        setResponses((prevResponses) => ({ ...prevResponses, [questionID]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const scoreMap: Record<string, { rawScore: number; stenScore: number }> = {};

        const formattedResponses = Object.entries(responses).map(([questionID, selectedChoice]) => {
            const question = test?.question.find((q: Question) => q.questionID === questionID);
            const equivalentScore = question?.choiceEquivalentScore?.[selectedChoice] || 0;
            const factorLetter = question?.factorLetter || '';

            if (factorLetter) {
                if (!scoreMap[factorLetter]) {
                    scoreMap[factorLetter] = { rawScore: 0, stenScore: 1 };
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

        const scoring = Object.entries(scoreMap).map(([factorLetter, { rawScore, stenScore }]) => ({
            factorLetter,
            rawScore,
            stenScore,
        }));

        const dataToSubmit = {
            userID,
            firstName,
            lastName,
            age,
            sex,
            course,
            year,
            section,
            testID: `${userID}-${Date.now()}`,  // Generate unique testID
            responses: formattedResponses,
            scoring,
            testType,
            testDate: new Date(),
        };

        try {
            await axios.post('http://localhost:5000/api/user16pf', dataToSubmit);
            alert('Test submitted successfully!');
            localStorage.setItem('pfTestResults', JSON.stringify(dataToSubmit));
            navigate('/pf-results');
        } catch (error) {
            console.error('Error submitting answers:', error);
            alert('An error occurred while submitting the test.');
        }
    };

    const totalPages = test?.question ? Math.ceil(test.question.length / questionsPerPage) : 1;
    const currentQuestions = test?.question.slice((currentPage - 1) * questionsPerPage, currentPage * questionsPerPage);

    const goToNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h1>{test?.nameofTest}</h1>
            <p>Number of Questions: {test?.numOfQuestions}</p>

            <div>
                <input type="text" placeholder="User ID" value={userID} onChange={(e) => setUserID(e.target.value)} required readOnly/>
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
                    <option value="" disabled>Select Exam Type</option>
                    <option value="Online">Online</option>
                </select>
            </div>

            <div className={styles.questionContainer}>
                {currentQuestions && currentQuestions.length > 0 ? (
                    currentQuestions.map((q: Question, index: number) => (
                        <div className={styles.questionBox} key={q.questionID}>
                            <p>{(currentPage - 1) * questionsPerPage + index + 1}. {q.questionText}</p>
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

            <div className={styles.pagination}>
                <button type="button" onClick={goToPreviousPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button type="button" onClick={goToNextPage} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>

            {currentPage === totalPages  && (
                <button className={styles.submitButton} type="submit">Submit Test</button>
            )}
        </form>
    );
};

export default PFTest;
