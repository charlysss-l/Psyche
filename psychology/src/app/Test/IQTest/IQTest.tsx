import React, { useEffect, useState } from 'react';
import style from './psychologyiqtest.module.scss'; // Importing custom SCSS styles
import { Link } from 'react-router-dom';
import backendUrl from '../../../config';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Interface definitions for the question and interpretation structures
interface Question {
    questionID: string;
    questionSet: string;
    questionImage: string;
    choicesImage: string[]; // Array of images for choices
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
    _id: string;
    testID: string;
    nameOfTest: string;
    numOfQuestions: number;
    questions: Question[];
    interpretation: Interpretation[];
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

const IQTest: React.FC = () => {
    const [iqTests, setIqTests] = useState<IQTests[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 12;
    const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File | null }>({});
    const [isEditing, setIsEditing] = useState<string | null>(null); // To track which question is being edited

    // Fetch data from the server
    const fetchData = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/IQtest`);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const data: IQTests[] = await response.json();
            setIqTests(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle image file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, questionID: string, imageType: 'questionImage' | 'choicesImage' | 'correctAnswer', index?: number) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            const key = `${questionID}-${imageType}-${index !== undefined ? index : ''}`;
            setSelectedFiles(prev => ({
                ...prev,
                [key]: file,
            }));
        }
    };

    // Upload the selected image to Firebase Storage
    const uploadImageToFirebase = async (file: File, path: string) => {
        const imageRef = ref(storage, path);
        await uploadBytes(imageRef, file);
        const downloadURL = await getDownloadURL(imageRef);
        return downloadURL;
    };

    // Handle image upload and update for the question
    const handleUpdateQuestion = async (questionID: string, imageType: 'questionImage' | 'choicesImage' | 'correctAnswer', index?: number) => {
        const file = selectedFiles[`${questionID}-${imageType}-${index !== undefined ? index : ''}`];
        if (file) {
            const path = `${imageType}/${questionID}/${file.name}`;
            const downloadURL = await uploadImageToFirebase(file, path);
            return downloadURL;
        }
        return null; // Return null if no file is selected
    };

    // Update question with new image URLs
    const handleSaveUpdatedQuestion = async (questionID: string, questionSet: string, correctAnswer: string) => {
        if (!questionID || !questionSet || !correctAnswer) {
            setError('Question ID, Question Set, and Correct Answer cannot be empty');
            return;
        }

        const updatedQuestionData: any = {
            questionID,
            questionSet,
            correctAnswer,
        };

        const imageTypes: ('questionImage' | 'choicesImage' | 'correctAnswer')[] = ['questionImage', 'choicesImage', 'correctAnswer'];

        for (const imageType of imageTypes) {
            if (imageType === 'choicesImage') {
                // Handle choices image upload for all choices
                const updatedChoiceImages: string[] = [];
                const currentChoices = iqTests[0].questions.find(q => q.questionID === questionID)?.choicesImage || [];
        
                for (let index = 0; index < 6; index++) { 
                    const choiceImageURL = await handleUpdateQuestion(questionID, imageType, index);
                    if (choiceImageURL) {
                        updatedChoiceImages.push(choiceImageURL); // Add new image if uploaded
                    } else if (currentChoices[index]) {
                        updatedChoiceImages.push(currentChoices[index]); // Preserve existing image
                    }
                }
                updatedQuestionData.choicesImage = updatedChoiceImages;
            } else {
                const downloadURL = await handleUpdateQuestion(questionID, imageType);
                if (downloadURL) {
                    updatedQuestionData[imageType] = downloadURL;
                } else {
                    const currentImage = iqTests[0].questions.find(q => q.questionID === questionID)?.[imageType];
                    if (currentImage) {
                        updatedQuestionData[imageType] = currentImage; // Preserve existing image if no new upload
                    }
                }
            }
        }

        // Send PUT request to update the question
        const response = await fetch(`${backendUrl}/api/IQtest/${iqTests[0]._id}/question/${questionID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedQuestionData),
        });

        alert('Question updated successfully');
        window.location.reload();

        if (!response.ok) {
            setError(`Failed to update question image: ${response.statusText}`);
        } else {
            fetchData(); // Reload data to reflect the changes
        }
    };

    // Display loading or error messages if necessary
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Flatten all the questions from the IQ tests
    const allQuestions = iqTests.flatMap(test => test.questions);

    // Calculate the total number of pages
    const totalPages = Math.ceil(allQuestions.length / resultsPerPage);

    // Slice the questions to display based on the current page
    const currentQuestions = allQuestions.slice(
        (currentPage - 1) * resultsPerPage,
        currentPage * resultsPerPage
    );

    return (
        <div>
            <table className={style.table}>
                <thead>
                    <tr>
                        <th className={style.th}>Test Name</th>
                        <th className={style.th}>Number of Questions</th>
                    </tr>
                </thead>
                <tbody>
                    {iqTests.map(test => (
                        <tr key={test._id}>
                            <td className={style.td}>Raven's Standard Progressive Matrices</td>
                            <td className={style.td}>{test.numOfQuestions}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h2>Questions</h2>
            <table className={style.table}>
                <thead>
                    <tr>
                        <th className={style.th}>Question ID</th>
                        <th className={style.th}>Question Set</th>
                        <th className={style.th}>Question Image</th>
                        <th className={style.th}>Choices Images</th>
                        <th className={style.th}>Correct Answer</th>
                        <th className={style.th}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentQuestions.map(q => (
                        <tr key={q.questionID}>
                            <td className={style.td}>{q.questionID}</td>
                            <td className={style.td}>{q.questionSet}</td>
                            <td className={style.question}>
                                <img src={q.questionImage} alt="Question" />
                                {isEditing === q.questionID && (
                                    <>
                                        <input
                                            type="file"
                                            onChange={(e) => handleFileChange(e, q.questionID, 'questionImage')}
                                        />
                                    </>
                                )}
                            </td>
                            <td className={style.choice}>
                                {q.choicesImage.map((choiceImage, index) => (
                                    <div key={index}>
                                        <img src={choiceImage} alt={`Choice ${index + 1}`} />
                                        {isEditing === q.questionID && (
                                            <input
                                                type="file"
                                                onChange={(e) => handleFileChange(e, q.questionID, 'choicesImage', index)}
                                            />
                                        )}
                                    </div>
                                ))}
                            </td>
                            <td className={style.answer}>
                                {isEditing === q.questionID ? (
                                    q.choicesImage.map((choiceImage, index) => (
                                        <div key={index}>
                                            <img src={choiceImage} alt={`Choice ${index + 1}`} />
                                            <input
                                                type="radio"
                                                name={`correctAnswer-${q.questionID}`}
                                                value={choiceImage}
                                                checked={q.correctAnswer === choiceImage}
                                                onChange={() =>
                                                    setIqTests(prev =>
                                                        prev.map(test =>
                                                            ({
                                                                ...test,
                                                                questions: test.questions.map(question =>
                                                                    question.questionID === q.questionID
                                                                        ? { ...question, correctAnswer: choiceImage }
                                                                        : question
                                                                )
                                                            })
                                                        )
                                                    )
                                                }
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div>
                                        <img src={q.correctAnswer} alt="Correct Answer" />
                                    </div>
                                )}
                            </td>
                            <td className={style.actions}>
                                <button
                                    className={style.editButton}
                                    onClick={() => setIsEditing(isEditing === q.questionID ? null : q.questionID)}
                                >
                                    {isEditing === q.questionID ? 'Cancel' : 'Edit'}
                                </button>
                                {isEditing === q.questionID && (
                                    <button
                                        className={style.saveButton}
                                        onClick={() => handleSaveUpdatedQuestion(q.questionID, q.questionSet, q.correctAnswer)}
                                    >
                                        Save
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button
                    className={style.paginationButton}
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                <span>{`Page ${currentPage} of ${totalPages}`}</span>
                <button
                    className={style.paginationButton}
                    onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default IQTest;
