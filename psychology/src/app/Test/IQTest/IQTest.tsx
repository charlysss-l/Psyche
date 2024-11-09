import React, { useEffect, useState } from 'react';
import style from './psychologyiqtest.module.scss'; // Importing custom SCSS styles

// Interface defining the structure of a single question
interface Question {
    questionID: string;
    questionSet: string;
    questionImage: string;
    choicesImage: string[];
    correctAnswer: string;
}

// Interface for interpretation data, used to interpret results
interface Interpretation {
    ageRange: string;  // Age range for interpretation (e.g., "5-7")
    sex: 'Female' | 'Male';
    minTestScore: number;
    maxTestScore: number;
    percentilePoints: number;
    resultInterpretation: string;
}

// Interface for the IQTests structure, containing test details and questions
interface IQTests {
    _id: string; // MongoDB document ID
    testID: string;
    nameOfTest: string;
    numOfQuestions: number;
    questions: Question[];
    interpretation: Interpretation[];
}

// IQTest component to display the list of IQ tests and their details
const IQTest: React.FC = () => {
    // State to store list of IQ tests
    const [iqTests, setIqTests] = useState<IQTests[]>([]);
    // State for loading status
    const [loading, setLoading] = useState(true);
    // State to store any error message if fetching fails
    const [error, setError] = useState<string | null>(null);

    // Function to fetch IQ test data from the server
    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/IQtest'); // Endpoint for fetching data
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`); // Throw error for non-200 status
            }
            const data: IQTests[] = await response.json(); // Parse JSON response
            setIqTests(data); // Set data to state
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred'); // Handle error
        } finally {
            setLoading(false); // Set loading to false when done
        }
    };

    // useEffect hook to fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    // Display loading or error messages if necessary
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

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

            <h2>Questions</h2>

            {/* Displaying the list of questions for each IQ test */}
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
                    {/* Flatten questions from all IQ tests for display */}
                    {iqTests.flatMap(test =>
                        test.questions.map(q => (
                            <tr key={q.questionID}>
                                <td className={style.td}>{q.questionID}</td>
                                <td className={style.td}>{q.questionSet}</td>
                                <td className={style.td}>
                                    <img src={q.questionImage} alt="Question" />
                                </td>
                                <td className={style.td}>
                                    {/* Display all choice images for the question */}
                                    {q.choicesImage.map((choiceImage, index) => (
                                        <img key={index} src={choiceImage} alt={`Choice ${index + 1}`} />
                                    ))}
                                </td>
                                <td className={style.td}>
                                    <img src={q.correctAnswer} alt="Correct Answer" />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default IQTest;
