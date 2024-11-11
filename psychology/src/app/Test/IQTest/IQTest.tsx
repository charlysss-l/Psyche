import React, { useEffect, useState } from 'react';
import style from './psychologyiqtest.module.scss'; // Importing custom SCSS styles
import { Link } from 'react-router-dom';

// Interface definitions for the question and interpretation structures
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
    _id: string;
    testID: string;
    nameOfTest: string;
    numOfQuestions: number;
    questions: Question[];
    interpretation: Interpretation[];
}

const IQTest: React.FC = () => {
    const [iqTests, setIqTests] = useState<IQTests[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 12;

    // Fetch data from the server
    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/IQtest');
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

    // useEffect hook to fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

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
            {/* Displaying the list of IQ tests */}
            <table className={style.table}>
                <thead>
                    <tr>
                        <th className={style.th}>Test Name</th>
                        <th className={style.th}>Num of Questions</th>
                    </tr>
                </thead>
                <tbody>
                    {iqTests.map(test => (
                        <tr key={test._id}>
                            <td className={style.td}>{test.nameOfTest}</td>
                            <td className={style.td}>{test.numOfQuestions}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link to="/iqresults_list">Test Results</Link>

            <h2>Questions</h2>
            <table className={style.table}>
                <thead>
                    <tr>
                        <th className={style.th}>Question ID</th>
                        <th className={style.th}>Question Set</th>
                        <th className={style.th}>Question Image</th>
                        <th className={style.th}>Choices Images</th>
                        <th className={style.th}>Correct Answer</th>
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
                                    <img key={index} src={choiceImage} alt={`Choice ${index + 1}`} />
                                ))}
                            </td>
                            <td className={style.answer}>
                                <img src={q.correctAnswer} alt="Correct Answer" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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
