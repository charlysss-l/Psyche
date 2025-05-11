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
    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        questionID: string,
        imageType: 'questionImage' | 'choicesImage',
        index?: number
      ) => {
        const file = e.target.files?.[0] || null;
        if (file) {
          const key = `${questionID}-${imageType}-${index !== undefined ? index : ''}`;
          setSelectedFiles((prev) => ({
            ...prev,
            [key]: file,
          }));
          console.log(`File selected for ${key}:`, file.name);
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

    // Modal component for editing images
    const ImageEditModal = ({ questionID }: { questionID: string }) => {
        const question = iqTests[0].questions.find(q => q.questionID === questionID);
        if (!question) return null;
    
        return (
            <div className={style.modal}>
                <div className={style.modalContent}>
                    <h2>Edit Question Images</h2> <br/>
                    <div className={style.modalBody}>
                    <h3>Question Image</h3>

                        <div className={style.questionContainer}>
                            <img className={style.questionImageModal} src={question.questionImage} alt="Question" />
                            <input
                                type="file"
                                id={`file-input-${questionID}-questionImage`}
                                onChange={(e) => handleFileChange(e, questionID, 'questionImage')}
                                style={{ display: 'none' }} // Hide the default input
                            />
                            <div className={style.customFileInput}>
                            <label htmlFor={`file-input-${questionID}-questionImage`} className={style.customFileLabel}>
                                {selectedFiles[`${questionID}-questionImage`] ? 
                                    selectedFiles[`${questionID}-questionImage`]?.name : 'Choose a file'}
                            </label>
                            <label htmlFor={`file-input-questionImage-${questionID}`} className={style.fileName}>
                            {selectedFiles[`${questionID}-questionImage-`]
                                ? selectedFiles[`${questionID}-questionImage-`]?.name
                                : ''}
                            </label>
                            </div>
                        </div>
                        <div>
                    <h3>Choices Images</h3>
                    <div className={style.choiceContainer}>
                        {question.choicesImage.map((choiceImage, index) => (
                            <div className={style.choiceImageContainer} key={index}>
                                <img className={style.choiceImageModal} src={choiceImage} alt={`Choice ${index + 1}`} />
                                <input
                                    type="file"
                                    id={`file-input-${questionID}-choicesImage-${index}`}
                                    onChange={(e) => handleFileChange(e, questionID, 'choicesImage', index)}
                                    style={{ display: 'none' }} // Hide the default input
                                />
                                <div className={style.customFileInput}>
                                    <label htmlFor={`file-input-${questionID}-choicesImage-${index}`} className={style.customFileLabel}>
                                        Choose a file
                                    </label>
                                    <label htmlFor={`file-input-${questionID}-choicesImage-${index}`} className={style.fileName}>
                                        {selectedFiles[`${questionID}-choicesImage-${index}`]
                                            ? selectedFiles[`${questionID}-choicesImage-${index}`]?.name
                                            : ''}
                                    </label>
                                </div>
                            </div>
                    ))}
                </div>
            </div>
            <div>
                <h3>Correct Answer</h3>
                <div className={style.answerContainer}>
                    {question.choicesImage.map((choiceImage, index) => (
                        <div className={style.answerImageContainer} key={index}>
                            <img className={style.answerImageModal} src={choiceImage} alt={`Choice ${index + 1}`} />
                            <input
                                type="radio"
                                name={`correctAnswer-${questionID}`}
                                value={choiceImage}
                                checked={question.correctAnswer === choiceImage}
                                onChange={() =>
                                    setIqTests(prev =>
                                        prev.map(test =>
                                            ({
                                                ...test,
                                                questions: test.questions.map(q =>
                                                    q.questionID === questionID
                                                        ? { ...q, correctAnswer: choiceImage }
                                                        : q
                                                )
                                            })
                                        )
                                    )
                                }
                            />
                        </div>
                    ))}
                </div>
            </div>

                    </div>
                    <div className={style.modalFooter}>
                        <button
                            className={style.saveChanges}    
                            onClick={() => handleSaveUpdatedQuestion(questionID, question.questionSet, question.correctAnswer)}
                        >
                            Save Changes
                        </button>
                        <button className={style.cancelChanges} onClick={() => setIsEditing(null)}>Close</button>
                    </div>
                </div>
            </div>
        );
    };
    

    return (
        <div className={style.maincontainer}>
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
            <div className={style.linkIQliinks}>
                <Link to="/iqresults_list_both" className={style.testResultsLink}>Test Results</Link>
                {/* <Link to="/iq-statistics" className={style.testResultsLink}>Analytics</Link> */}
                <Link to="/iqinterpretation" className={style.testResultsLink}>Edit IQ Interpretation</Link>
            
            </div>
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
                            </td>
                            <td className={style.choice}>
                                {q.choicesImage.map((choiceImage, index) => (
                                    <div key={index}>
                                        <img src={choiceImage} alt={`Choice ${index + 1}`} />
                                    </div>
                                ))}
                            </td>
                            <td className={style.answer}>
                                    <div>
                                        <img src={q.correctAnswer} alt="Correct Answer" />
                                    </div>
                            </td>
                            <td className={style.actions}>
                                <button
                                    className={style.editButton}
                                    onClick={() => setIsEditing(isEditing === q.questionID ? null : q.questionID)}
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isEditing && <ImageEditModal questionID={isEditing} />}

            
            {/* Pagination Controls */}
            <div className={style.pagination}>
                <button
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
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
