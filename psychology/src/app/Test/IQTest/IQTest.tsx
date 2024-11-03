import React, { useEffect, useState } from 'react';
import style from './page.module.scss';

interface Question {
    questionID: string;
    questionSet: string;
    questionImage: string;
    choicesImage: string[];
    correctAnswer: string;
}

interface Interpretation {
    ageRange: string;  // e.g., "5-7"
    sex: 'Female' | 'Male';
    minTestScore: number;
    maxTestScore: number;
    percentilePoints: number;
    resultInterpretation: string;
}

interface IQTests {
    _id: string; // Assuming this is the MongoDB document ID
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

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/IQtest'); // Update the endpoint accordingly
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
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
                    {iqTests.flatMap(test =>
                        test.questions.map(q => (
                            <tr key={q.questionID}>
                                <td className={style.td}>{q.questionID}</td>
                                <td className={style.td}>{q.questionSet}</td>
                                <td className={style.td}><img src={q.questionImage} alt="Question" /></td>
                                <td className={style.td}>
                                    {q.choicesImage.map((choiceImage, index) => (
                                        <img key={index} src={choiceImage} alt={`Choice ${index + 1}`} />
                                    ))}
                                </td>
                                <td className={style.td}><img src={q.correctAnswer} alt="Correct Answer" /></td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default IQTest;
