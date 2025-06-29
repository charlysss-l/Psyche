import React, { useEffect, useState } from 'react';
import axios from 'axios';
import style from "../CFTest/CFTest.module.scss";
import { useNavigate } from 'react-router-dom';
import backendUrl from '../../../config';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

interface Question {
    questionID: string;
    questionSet: string;
    questionImage: string;
    choicesImage: string[];
    correctAnswer: string | string[]; 
  }

  interface Interpretation {
    byId: string; // This will automatically be assigned by MongoDB
    minAge: number;  
    maxAge: number;
    minTestScore: number;
    maxTestScore: number;
    iqScore: number;
    percentilePoints: number;
    resultInterpretation: string;
}

interface CFTests {
    testID: string;
    nameOfTest: string;
    numOfQuestions: number;
    questions: Question[];
    interpretation: Interpretation[];  // Added interpretation field

}


const firebaseConfig = {
    apiKey: "AIzaSyBWj1L7qdsRH4sFpE7q0CaoyL55KWMGRZI",
    authDomain: "iqtestupload.firebaseapp.com",
    projectId: "iqtestupload",
    storageBucket: "iqtestupload.appspot.com",
    messagingSenderId: "1045353089399",
    appId: "1:1045353089399:web:e921f8910028d4b91db972",
    measurementId: "G-Y50EWBBRFQ"
  };

initializeApp(firebaseConfig);
const storage = getStorage();

const CFTest: React.FC = () => {
    const navigate = useNavigate();
    const [cfTest, setCfTest] = useState<CFTests | null>(null);
    const [testLoading, setTestLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);  
    const [error, setError] = useState<string | null>(null);
    const [responses, setResponses] = useState<Record<string, string | string[]>>({}); // Updated to handle arrays
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
    const [timer, setTimer] = useState<number>(45 * 60); // 45 minutes in seconds
    const [isTimeUp, setIsTimeUp] = useState<boolean>(false);
    const [, setInterpretation] = useState<Interpretation | null>(null);
    const [exampleImages, setExampleImages] = useState<Record<string, string>>({}); // Store images per question set
    const [unansweredQuestions, setUnansweredQuestions] = useState<string[]>([]);

       useEffect(() => {
                      // Set viewport for zoom-out effect
                      const metaViewport = document.querySelector('meta[name="viewport"]');
                      if (metaViewport) {
                        metaViewport.setAttribute("content", "width=device-width, initial-scale=0.7, maximum-scale=1.0");
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


    // Group questions by questionSet
    const groupedQuestions = cfTest?.questions.reduce((acc, question) => {
        if (!acc[question.questionSet]) {
            acc[question.questionSet] = [];
        }
        acc[question.questionSet].push(question);
        return acc;
    }, {} as Record<string, Question[]>);

    const questionSets = groupedQuestions ? Object.keys(groupedQuestions) : [];
    const totalPages = questionSets.length; // Each page represents a questionSet
    const currentQuestionSet = questionSets[currentPage - 1];
    const currentQuestions = groupedQuestions ? groupedQuestions[currentQuestionSet] : [];

    const fetchTest = async () => {
        try {
            const response = await axios.get<CFTests>(`${backendUrl}/api/CFtest/67a09ef7e3fdfebbf170a124`);
            setCfTest(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setTestLoading(false);
        }
    };

    // Fetch example images from Firebase Storage
    const fetchExampleImages = async () => {
        try {
            const storageRef = ref(storage, "cf-test-examples"); // Reference to the folder
            const fileList = await listAll(storageRef); // Get all images
    
            const imageUrls = await Promise.all(
                fileList.items.map(async (item, index) => {
                    const url = await getDownloadURL(item);
                    return { [`Test ${index + 1}`]: url }; // Assuming the tests are named "Test 1", "Test 2", etc.
                })
            );
    
            // Convert array of objects into a single object
            const imageMap = Object.assign({}, ...imageUrls);
            setExampleImages(imageMap);
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    };
    
    useEffect(() => {
        fetchExampleImages();
    }, []);

    useEffect(() => {
        fetchExampleImages();
    }, []);

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
        // Load timer from localStorage or set initial value
        const storedTime = localStorage.getItem('cfTestTimer');
        if (storedTime) {
            setTimer(parseInt(storedTime, 10));
        } else {
            setTimer(45 * 60); // 45 minutes
        }
    }, []);
    
    useEffect(() => {
        const timerID = setInterval(() => {
            setTimer((prevTime) => {
                if (prevTime > 0) {
                    const newTime = prevTime - 1;
                    localStorage.setItem('cfTestTimer', newTime.toString());
                    return newTime;
                } else {
                    clearInterval(timerID);
                    setIsTimeUp(true);
                    handleSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>);
                    return 0;
                }
            });
        }, 1000);
    
        return () => clearInterval(timerID);
    }, []);
    

    // Handle multiple selections for Test 2
    const handleChange = (questionID: string, value: string) => {
        setResponses((prevResponses) => {
            const currentResponse = prevResponses[questionID];
            if (currentQuestionSet === 'Test 2') {
                // For Test 2, handle multiple selections
                const updatedResponse = Array.isArray(currentResponse) ? [...currentResponse] : [];
                if (updatedResponse.includes(value)) {
                    // Remove the value if it's already selected
                    return { ...prevResponses, [questionID]: updatedResponse.filter((v) => v !== value) };
                } else {
                    // Add the value if it's not already selected
                    return { ...prevResponses, [questionID]: [...updatedResponse, value] };
                }
            } else {
                // For other tests, handle single selection
                return { ...prevResponses, [questionID]: value };
            }
        });
    };

    // Calculate score, handling array-based correct answers
    const calculateScore = () => {
        const totalCorrect = Object.keys(responses).reduce((total, questionID) => {
            const question = cfTest?.questions.find((q) => q.questionID === questionID);
            if (!question) return total;
    
            const correctAnswer = question.correctAnswer;
            const userResponse = responses[questionID];
    
            if (Array.isArray(correctAnswer)) {
                // For Test 2, check if the user's selected answers match the correct answers (order-independent)
                if (Array.isArray(userResponse)) {
                    // Sort both arrays and compare them
                    const sortedCorrectAnswer = [...correctAnswer].sort();
                    const sortedUserResponse = [...userResponse].sort();
                    return total + (JSON.stringify(sortedCorrectAnswer) === JSON.stringify(sortedUserResponse) ? 1 : 0);
                }
            } else {
                // For other tests, check if the response matches the correct answer
                return total + (userResponse === correctAnswer ? 1 : 0);
            }
    
            return total;
        }, 0);
    
        return { correctAnswer: `${totalCorrect}`, totalScore: totalCorrect };
    };


    // Render choices for Test 2 with checkboxes
    const renderChoices = (question: Question) => {
        const response = responses[question.questionID];
        const isTest2 = currentQuestionSet === 'Test 2';
        const isInvalid = isTest2 && Array.isArray(response) && response.length !== 2;
    
        return (
            <>
                
                {question.choicesImage.map((choice, idx) => (
                    <label key={idx}>
                        <input
                            type={isTest2 ? 'checkbox' : 'radio'} // Use checkbox for Test 2
                            name={question.questionID}
                            value={choice}
                            checked={
                                isTest2
                                    ? (response as string[] | undefined)?.includes(choice) || false
                                    : response === choice
                            }
                            onChange={() => handleChange(question.questionID, choice)}
                        />
                        <img src={choice} alt={`Choice ${idx}`} />
                    </label>
                ))}
                {isInvalid && (
                    <p className={style.warningMessage}>Please select exactly two answers.</p>
                )}
            </>
        );
    };

    const validateTest2Responses = () => {
        if (currentQuestionSet === 'Test 2') {
            return currentQuestions.every(question => {
                const response = responses[question.questionID];
                return Array.isArray(response) && response.length === 2;
            });
        }
        return true; // No validation needed for other tests
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateTest2Responses()) {
            alert('Please select exactly two answers for each question in Test 2.');
            return;
        }

        // Check for unanswered questions
        const unanswered = cfTest?.questions
        .filter((q) => !responses[q.questionID])
        .map((q) => q.questionID) || [];

        if (unanswered.length > 0) {
            setUnansweredQuestions(unanswered);
            alert('Please answer all the questions before submitting the test.');
            return;
        }

        // Clear unanswered questions state if all are answered
        setUnansweredQuestions([]);

        const responsesWithAnswers = Object.keys(responses).map((questionID) => {
            const question = cfTest?.questions.find((q) => q.questionID === questionID);
            if (!question) return null;
    
            const correctAnswer = question.correctAnswer;
            const userResponse = responses[questionID];
    
            let isCorrect = false;
            if (Array.isArray(correctAnswer)) {
                // For Test 2, check if the user's selected answers match the correct answers (order-independent)
                if (Array.isArray(userResponse)) {
                    const sortedCorrectAnswer = [...correctAnswer].sort();
                    const sortedUserResponse = [...userResponse].sort();
                    isCorrect = JSON.stringify(sortedCorrectAnswer) === JSON.stringify(sortedUserResponse);
                }
            } else {
                // For other tests, check if the response matches the correct answer
                isCorrect = userResponse === correctAnswer;
            }
    
            return {
                questionID,
                selectedChoice: userResponse,
                isCorrect,
            };
        }).filter(Boolean); // Remove null values
    
        const score = calculateScore();
        const matchedInterpretation = cfTest?.interpretation.find((interp) =>
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
            testID: cfTest?.testID || '',
            responses: responsesWithAnswers,
            totalScore: score.totalScore,
            interpretation: matchedInterpretation || null,
            testType,
            testDate: new Date(),
        };

        setSubmitLoading(true); // Set loading to true before making the request

    
        try {
            await axios.post(`${backendUrl}/api/usercf`, dataToSubmit);
            alert('Test submitted successfully!');
            localStorage.setItem('cfTestResults', JSON.stringify(dataToSubmit));
            navigate('/cf-results');
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                alert(error.response.data.message);
            } else {
                console.error('Error submitting answers:', error);
                alert('An error occurred while submitting the test.');
            }
        } finally {
            setSubmitLoading(false); // Set loading back to false after the request is complete
        }
    };

const handleNextPage = () => {
    const currentQuestion = currentQuestions?.[0]; // Since there's 1 question per page
    if (currentQuestion && !responses[currentQuestion.questionID]) {
        alert('Please answer the questions before proceeding to the next page.');
        return;
    }

    setCurrentPage((prevPage) => {
        const nextPage = Math.min(prevPage + 1, totalPages);
        if (nextPage !== prevPage) window.scrollTo(0, 0);
        return nextPage;
    });
};

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    if (testLoading) return <p>Loading Test...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <form onSubmit={handleSubmit} className={style.formTest}>
            <h1>Culture Fair Test</h1>
            <p className={style.numQuestion}>Number of Questions: {cfTest?.numOfQuestions}</p>
            <p className={style.ageWarning}> 
                "You Only Have 45 Minutes To Complete This Test. The Test Will Automatically Submit Once Time Is Up" <br/>
                You can only answer this test once a day, if any error occurs and need to retake the test, please direct to the administrator (Psychology Department).
            </p>
            <h1 className={style.rulesTitle}>Rules:</h1>
            <p className={style.rules}>
            <span className={style.highlight}>*</span> Please do not take screenshots or share the content of this test. It is confidential and for your use only. <br />
                <span className={style.highlight}>*</span> Those who do will be penalized and as your student record will be tracked by the Administrators. <br />
            </p>
            <p>Time Remaining: {Math.floor(timer / 60)}:{timer % 60}</p>

            {currentQuestionSet && (
                <>
                    <h2 className={style.testLabel}>{currentQuestionSet}</h2>
                    {currentQuestionSet === "Test 2" && <p className={style.ageWarning}> Required Two (2) Answers Only per Item in Test 2</p>}
                </>
            )}


            {/* Display example images */}
            {currentQuestionSet && exampleImages[currentQuestionSet] && (
                <img 
                    src={exampleImages[currentQuestionSet]} 
                    alt={`Example for ${currentQuestionSet}`} 
                    style={{ width: "80%", maxHeight: "300px", objectFit: "contain", marginBottom: "20px" }}
                />
            )}

               

            {/* Your form fields here */}

            <div className={style.questionContainer}>
                {currentQuestions?.map((q, index) => {
                    const isUnanswered = unansweredQuestions.includes(q.questionID);
                    return (
                        <div
                            className={`${style.questionBox} ${isUnanswered ? style.unanswered : ''}`}
                            key={q.questionID}
                        >
                            <p className={style.questionNumber}> {index + 1}.</p>
                            <img
                                src={q.questionImage}
                                alt={`Question ${q.questionID}`}
                                className={currentQuestionSet === 'Test 1' ? style.rectImageImgTest1 :
                                    currentQuestionSet === 'Test 2' ? style.rectImageImgTest2 :
                                    currentQuestionSet === 'Test 3' ? style.squareImageImgTest3 : 
                                    currentQuestionSet === 'Test 4' ? style.squareImageImgTest4 : ''}
                            />
                            {isUnanswered && (
                                <p className={style.warningMessageUnanswered}>This question is unanswered.</p>
                            )}
                            <div className={style.choiceALL}>
                                {renderChoices(q)}
                            </div>
                        </div>
                    );
                })}
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
            <button type="submit" className={style.submitButton} disabled={submitLoading}>
            {submitLoading ? 'Submitting...' : 'Submit Test'}
            </button>   
            )}

        </form>
    );
};

export default CFTest;
