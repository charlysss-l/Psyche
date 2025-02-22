import React, { useEffect, useState } from 'react';
import axios from 'axios';
import style from './studentiqtest.module.scss';
import { useNavigate } from 'react-router-dom';
import backendUrl from '../../../config';

interface Question {
    questionID: string;
    questionSet: string;
    questionImage: string;
    choicesImage: string[];
    correctAnswer: string;
}

interface Interpretation {
    minAge: number;
    maxAge: number;
    minTestScore: number;
    maxTestScore: number;
    resultInterpretation: string;
}

interface IQTests {
    testID: string;
    nameOfTest: string;
    numOfQuestions: number;
    questions: Question[];
    interpretation: Interpretation[];  // Added interpretation field

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
    const [course, setCourse] = useState<string>('');
    const [year, setYear] = useState<string>('');
    const [section, setSection] = useState<string>('');
    const [sex, setSex] = useState<'Male' | 'Female' | ''>('');
    const [testType, setTestType] = useState<'Online' | 'Physical' | ''>('');    
    const [currentPage, setCurrentPage] = useState(1);
    const questionsPerPage = 5; // Display 5 questions per page
    const [timer, setTimer] = useState<number>(45 * 60); // 45 minutes in seconds
    const [isTimeUp, setIsTimeUp] = useState<boolean>(false);
    const [, setInterpretation] = useState<Interpretation | null>(null);
    const [unansweredQuestions, setUnansweredQuestions] = useState<string[]>([]);


    const fetchTest = async () => {
        try {
            const response = await axios.get<IQTests>(`${backendUrl}/api/IQtest/67277ea7aacfc314004dca20`);
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
        // Retrieve user details from localStorage and set them in state
        const storedUserDetails = localStorage.getItem("userDetails");
        if (storedUserDetails) {
            const {  firstName, lastName, age, sex, course, year, section, testType } = JSON.parse(storedUserDetails);
            setFirstName(firstName);
            setLastName(lastName);
            setAge(age);
            setSex(sex);
            setCourse(course);
            setYear(year);
            setSection(section);
            setTestType(testType);
        }
    }, []);

    useEffect(() => {
        fetchTest();
    }, []);

    useEffect(() => {
        if (timer === 0) {
            setIsTimeUp(true);
            handleSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>); // Corrected here
        }
    }, [timer]);

    useEffect(() => {
        const timerID = setInterval(() => {
            if (timer > 0) {
                setTimer(prevTime => prevTime - 1);
            }
        }, 1000);

        return () => clearInterval(timerID); // Cleanup on component unmount
    }, [timer]);

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Check for unanswered questions
        const unanswered = iqTest?.questions
            .filter((q: { questionID: string | number; }) => !responses[q.questionID])
            .map((q: { questionID: any; }) => q.questionID) || [];

        if (unanswered.length > 0) {
            setUnansweredQuestions(unanswered);
            alert('Please answer all the questions before submitting the test.');
            return;
        }

        // Clear unanswered questions state if all are answered
        setUnansweredQuestions([]);

        const responsesWithAnswers = Object.keys(responses).map(questionID => {
            const question = iqTest?.questions.find(q => q.questionID === questionID);
            return {
                questionID,
                selectedChoice: responses[questionID],
                isCorrect: question?.correctAnswer === responses[questionID]
            };
        });

        const score = calculateScore();
       // Determine interpretation based on age and score
       const matchedInterpretation = iqTest?.interpretation.find((interp) => 
        Number(age) >= interp.minAge &&
        Number(age) <= interp.maxAge &&
        score.totalScore >= interp.minTestScore &&
        score.totalScore <= interp.maxTestScore
    );
    
    setInterpretation(matchedInterpretation || null);

        const dataToSubmit = {
            userID,
            firstName,
            lastName,
            age,
            sex,
            course,
            year,
            section,
            testID: iqTest?.testID || '',
            responses: responsesWithAnswers,
            totalScore: score.totalScore,
            interpretation: matchedInterpretation || null,
            testType,
            testDate: new Date(),
        };

        try {
            await axios.post(`${backendUrl}/api/useriq`, dataToSubmit);
            alert('Test submitted successfully!');
            localStorage.setItem('iqTestResults', JSON.stringify(dataToSubmit));
            navigate('/iq-results');
        } catch (error: any) {
        if (error.response && error.response.status === 400) {
            alert(error.response.data.message); // Display the error message from the server
        } else {
            console.error('Error submitting answers:', error);
            alert('An error occurred while submitting the test.');
        }
    }
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => {
            const nextPage = Math.min(prevPage + 1, totalPages);
            if (nextPage !== prevPage) window.scrollTo(0, 0); // Scroll to top
            return nextPage;
        });
    }
    const handlePrevPage = () => setCurrentPage(prev => prev - 1);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const totalQuestions = iqTest?.questions.length || 0;
    const totalPages = Math.ceil(totalQuestions / questionsPerPage);
    const startIndex = (currentPage - 1) * questionsPerPage;
    const currentQuestions = iqTest?.questions.slice(startIndex, startIndex + questionsPerPage);

    return (
        <form onSubmit={handleSubmit} className={style.formTest}>
            <h1>IQ Test</h1>
            <p>Number of Questions: {iqTest?.numOfQuestions}</p>
            <p className={style.ageWarning}> 
                "You Only Have 45 Minutes To Complete This Test. The Test Will Automatically Submit Once Time Is Up" <br/>
                You can only answer this test once a day, if any error occurs and need to retake the test, please direct to the administrator (Psychology Department).
            </p>
            <h1>Rules:</h1>
            <p className={style.rules}>
            <span className={style.highlight}>*</span> Please do not take screenshots or share the content of this test. It is confidential and for your use only. <br />
                <span className={style.highlight}>*</span> Those who do will be penalized and as your student record will be tracked by the Administrators. <br />
            </p>
            <p>Time Remaining: {Math.floor(timer / 60)}:{timer % 60}</p>

            {/* Your form fields here */}

            <div className={style.questionContainer}>
                {currentQuestions?.map((q) => {
                    const isUnanswered = unansweredQuestions.includes(q.questionID);
                    return (
                        <div
                            className={`${style.questionBox} ${isUnanswered ? style.unanswered : ''}`}
                            key={q.questionID}
                        > 
                        {isUnanswered && (
                                <p className={style.warningMessage}>This question is unanswered.</p>
                        )}
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
                )}
                )}
                
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
            {isTimeUp && <p>Your time is up. The test is automatically submitted.</p>}
            
            {/* Only show submit button on the last page */}
            {currentPage === totalPages && (
                <button type="submit" className={style.submitButton}>Submit Test</button>
            )}

        </form>
    );
};

export default IQTest;
