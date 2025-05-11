import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './studentpftest.module.scss';
import { User16PFTest, Question } from '../../../types/pfTestTypes';
import { useNavigate } from 'react-router-dom';
import backendUrl from '../../../config';

const PFTest: React.FC = () => {
    const [test, setTest] = useState<User16PFTest | null>(null);
    const [testLoading, setTestLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [responses, setResponses] = useState<Record<string, string>>({});
    const [currentPage, setCurrentPage] = useState<number>(1);
    const questionsPerPage = 15; // Number of questions per page
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
    const [unansweredQuestions, setUnansweredQuestions] = useState<string[]>([]);

    useEffect(() => {
        // Fetch userID from localStorage and set it in state
        const storedUserID = localStorage.getItem('userId');
        if (storedUserID) {
            setUserID(storedUserID);
        }

        fetchTest();
    }, []);

      useEffect(() => {
            // Set viewport for zoom-out effect
            const metaViewport = document.querySelector('meta[name="viewport"]');
            if (metaViewport) {
              metaViewport.setAttribute("content", "width=device-width, initial-scale=0.8, maximum-scale=1.0");
            } else {
              const newMeta = document.createElement("meta");
              newMeta.name = "viewport";
              newMeta.content = "width=device-width, initial-scale=0.8, maximum-scale=1.0, user-scalable=no";
              document.head.appendChild(newMeta);
            }
        
            // Cleanup function to reset viewport when leaving the page
            return () => {
              if (metaViewport) {
                metaViewport.setAttribute("content", "width=device-width, initial-scale=1.0");
              }
            };
          }, []);

   

    const shuffleQuestions = (questions: Question[]): Question[] => {
        // Use the Fisher-Yates algorithm for shuffling
        const shuffled = [...questions];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };
    
    
    const fetchTest = async () => {
        try {
            const response = await axios.get<User16PFTest>(`${backendUrl}/api/16pf/67282807d9bdba831a7e9063`);
            const randomizedQuestions = shuffleQuestions(response.data.question);
            setTest({ ...response.data, question: randomizedQuestions });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setTestLoading(false);
        }
    };
    
    

    const handleChange = (questionID: string, value: string) => {
        setResponses((prevResponses) => ({ ...prevResponses, [questionID]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check for unanswered questions
        const unanswered = test?.question
            .filter((q) => !responses[q.questionID])
            .map((q) => q.questionID) || [];

        if (unanswered.length > 0) {
            setUnansweredQuestions(unanswered);
            alert('Please answer all the questions before submitting the test.');
            return;
        }

        // Clear unanswered questions state if all are answered
        setUnansweredQuestions([]);

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

        setSubmitLoading(true); // Set loading to true before making the request


        try {
            await axios.post(`${backendUrl}/api/user16pf`, dataToSubmit);
            alert('Test submitted successfully!');
            localStorage.setItem('pfTestResults', JSON.stringify(dataToSubmit));
            navigate('/pf-results');
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                alert(error.response.data.message); // Display the error message from the server
            } else {
                console.error('Error submitting answers:', error);
                alert('An error occurred while submitting the test.');
            }
        } finally {
            setSubmitLoading(false); // Set loading to false after request completes
          }
    };

    const totalPages = test?.question ? Math.ceil(test.question.length / questionsPerPage) : 1;
    const currentQuestions = test?.question.slice((currentPage - 1) * questionsPerPage, currentPage * questionsPerPage);

    const goToNextPage = () => {
        setCurrentPage((prevPage) => {
            const nextPage = Math.min(prevPage + 1, totalPages);
            if (nextPage !== prevPage) window.scrollTo(0, 0); // Scroll to top
            return nextPage;
        });
    };
    
    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };
    

    if (testLoading) return <p>Loading test...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h1 className={styles.PFtitle}>{test?.nameofTest}</h1>
            <h2 className={styles.instruction}>Instructions:</h2>
            <p>
                <em>
                <span className={styles.highlight}>*</span> This 16 PF personality test contains <span className={styles.highlight}>{test?.question.length}</span> statements. <br />
                <span className={styles.highlight}>*</span> There is no time limit. Please allow yourself plenty of time. <br />
                <span className={styles.highlight}>*</span> Please respond to all of the statements and answer in sequence. <br />
                <span className={styles.highlight}>*</span> Double-check that you have made the right choice. If you need to change an answer, simply select the new response and the incorrect response will disappear. <br />
                <span className={styles.highlight}>*</span> The '? / Neutral' option is for those who do not know or not sure about the answer. <br />
                <span className={styles.highlight}>*</span> Try not to use the '? / Neutral' option too often. <br />
                <span className={styles.highlight}>*</span> Describe yourself as you honestly see yourself now, not as you wish to be in the future. <br />
                </em>
            </p>
            <h2 className={styles.rules}>Rules:</h2>
            <p className={styles.warning}>
            <em>

            <span className={styles.highlight}>*</span> Please do not take screenshots or share the content of this test. It is confidential and for your use only. <br />

                <span className={styles.highlight}>*</span> Those who do will be penalized and as your student record will be tracked by the Administrators. <br />
                </em>
            </p>

    
            {/* Demographic Form Fields - Only on the First Page */}
            {currentPage === 1 && (
                <div>
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
                        <option value="BSEduc">Bachelor of Secondary Education</option>
                <option value="BSBM">BS Business Management</option>
                <option value="BSCS">BS Computer Science</option>
                <option value="BSCrim">BS Criminology</option>
                <option value="BSHM">BS Hospitality Management</option>                    
                <option value="BSIT">BS Information Technology</option>
                <option value="BSP">BS Psychology</option>
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
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="Irregular">Irregular</option>
                    </select>
                    <select value={testType} onChange={(e) => setTestType(e.target.value as 'Online' | 'Physical')} required>
                        <option value="" disabled>Select Exam Type</option>
                        <option value="Online">Online</option>
                    </select>
                </div>
            )}
    
            {/* Questions */}
            <div className={styles.questionContainer}>
            {currentQuestions && currentQuestions.length > 0 ? (
                currentQuestions.map((q: Question, index: number) => {
                    const isUnanswered = unansweredQuestions.includes(q.questionID);
                    return (
                        <div
                            className={`${styles.questionBox} ${isUnanswered ? styles.unanswered : ''}`}
                            key={q.questionID}
                        >
                            <p className={styles.questions}>{(currentPage - 1) * questionsPerPage + index + 1}. {q.questionText}</p>
                            {isUnanswered && (
                                <p className={styles.warningMessage}>This question is unanswered.</p>
                            )}
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
                    );
                })
            ) : (
                <p>No questions available</p>
            )}
        </div>
    
            {/* Pagination */}
            <div className={styles.pagination}>
                <button type="button" onClick={goToPreviousPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button type="button" onClick={goToNextPage} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
    
            {/* Submit Button */}
            {currentPage === totalPages && (
                <button type="submit" className={styles.submitButton} disabled={submitLoading}>
                {submitLoading ? 'Submitting...' : 'Submit'}
            </button>
            
            )}
        </form>
    );
    
};

export default PFTest;
