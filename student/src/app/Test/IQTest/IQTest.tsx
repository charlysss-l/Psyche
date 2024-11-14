import React, { useEffect, useState } from 'react';
import axios from 'axios';
import style from './studentiqtest.module.scss';
import { useNavigate } from 'react-router-dom';

interface Question {
    questionID: string;
    questionSet: string;
    questionImage: string;
    choicesImage: string[];
    correctAnswer: string;
}

interface Interpretation {
    ageRange: string;
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
    const navigate = useNavigate();
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
    const [currentPage, setCurrentPage] = useState(1);
    const questionsPerPage = 5; // Display 5 questions per page

    const fetchTest = async () => {
        try {
            const response = await axios.get<IQTests>('http://localhost:5000/api/IQtest/67277ea7aacfc314004dca20');
            setIqTest(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Retrieve studentId from localStorage when component mounts
        const storedStudentId = localStorage.getItem("studentId");
        if (storedStudentId) {
          setUserID(storedStudentId);
        }
      }, []);

    useEffect(() => {
        fetchTest();
    }, []);

    const handleChange = (questionID: string, value: string) => {
        setResponses((prevResponses) => ({ ...prevResponses, [questionID]: value }));
    };

    const calculateScore = () => {
        const totalCorrect = Object.keys(responses).reduce((total, questionID) => {
            const question = iqTest?.questions.find(q => q.questionID === questionID);
            return total + (question?.correctAnswer === responses[questionID] ? 1 : 0);
        }, 0);
        return { correctAnswer: `${totalCorrect}`, totalScore: totalCorrect };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const responsesWithAnswers = Object.keys(responses).map(questionID => {
            const question = iqTest?.questions.find(q => q.questionID === questionID);
            return {
                questionID,
                selectedChoice: responses[questionID],
                isCorrect: question?.correctAnswer === responses[questionID]
            };
        });

        const score = calculateScore();
        const interpretation: Interpretation = {
            ageRange: '20-30',
            sex,
            minTestScore: 10,
            maxTestScore: 100,
            percentilePoints: 85,
            resultInterpretation: 'Above average intelligence',
        };

        const dataToSubmit = {
            userID,
            firstName,
            lastName,
            age,
            sex,
            testID: iqTest?.testID || '',
            responses: responsesWithAnswers,
            totalScore: score.totalScore,
            interpretation,
            testType,
            testDate: new Date(),
        };

        try {
            await axios.post('http://localhost:5000/api/useriq', dataToSubmit);
            alert('Test submitted successfully!');
            localStorage.setItem('iqTestResults', JSON.stringify(dataToSubmit));
            navigate('/iq-results');
        } catch (error) {
            console.error('Error submitting answers:', error);
            alert('An error occurred while submitting the test.');
        }
    };

    const handleNextPage = () => setCurrentPage(prev => prev + 1);
    const handlePrevPage = () => setCurrentPage(prev => prev - 1);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const totalQuestions = iqTest?.questions.length || 0;
    const totalPages = Math.ceil(totalQuestions / questionsPerPage);
    const startIndex = (currentPage - 1) * questionsPerPage;
    const currentQuestions = iqTest?.questions.slice(startIndex, startIndex + questionsPerPage);

    return (
        <form onSubmit={handleSubmit} className={style.formTest}>
            <h1>{iqTest?.nameOfTest}</h1>
            <p>Number of Questions: {iqTest?.numOfQuestions}</p>
            <p className={style.ageWarning}> "You Must Be 20 Years Old and Above To Take This Test" <br/> 
            "You Only Have 45 Minutes To Complete This Test. The Test Will Automatically Submit Once Time Is Up"
            </p>

            <div>
            <input
        type="text"
        id="studentId"
        value={userID || ""}
        readOnly // Make the field read-only if you don't want it to be editable
      />                <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} required />
                <select value={sex} onChange={(e) => setSex(e.target.value as 'Male' | 'Female')} required>
                    <option value="" disabled>Select Sex</option> {/* Placeholder option */}
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
                <select value={testType} onChange={(e) => setTestType(e.target.value as 'Online' | 'Physical')} required>
                    <option value="" disabled>Select Exam Type</option> {/* Placeholder option */}
                    <option value="Online">Online</option>
                    <option value="Physical">Physical</option>
                </select>
            </div>
            <div className={style.questionContainer}>
                {currentQuestions?.map((q) => (
                    <div className={style.questionBox} key={q.questionID}>
                        <img src={q.questionImage} alt={`Question ${q.questionID}`} />
                        <div className={style.choiceALL}>
                            {q.choicesImage.map((choice, idx) => (
                                <label key={idx}>
                                    <input
                                        type="radio"
                                        name={q.questionID}
                                        value={choice}
                                        checked={responses[q.questionID] === choice}
                                        onChange={() => handleChange(q.questionID, choice)}
                                    />
                                    <img src={choice} alt={`Choice ${idx}`} />
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className={style.pagination}>
                <button type="button" onClick={handlePrevPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button type="button" onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
            {currentPage === totalPages && (
                <button type="submit">Submit Answers</button>
            )}
        </form>
    );
};

export default IQTest;
