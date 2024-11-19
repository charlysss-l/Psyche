import React, { useEffect, useState } from 'react';
import style from './pftest.module.scss';
import { Link } from 'react-router-dom';

interface Choice {
    a: string;
    b: string;
    c: string;
}

interface ChoiceEquivalentScore {
    a: number;
    b: number;
    c: number;
}

interface Question {
    questionID: string;
    questionNum: number;
    questionText: string;
    choices: Choice;
    choiceEquivalentScore: ChoiceEquivalentScore;
    factorLetter: string; 
}

interface Test {
    _id: string;
    testID: string;
    nameofTest: string;
    numOfQuestions: number;
    question: Question[];
}

const PFTest: React.FC = () => {
    const [pfTest, setPfTest] = useState<Test[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 10;

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/16pf');
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const data: Test[] = await response.json();
            setPfTest(data);
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

    // Flatten questions across all tests
    const allQuestions = pfTest.flatMap(test => test.question);

    // Calculate the total number of pages
    const totalPages = Math.ceil(allQuestions.length / resultsPerPage);

    // Slice questions based on the current page
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
                        <th className={style.th}>Num of Questions</th>
                    </tr>
                </thead>
                <tbody>
                    {pfTest.map(test => (
                        <tr key={test._id}>
                            <td className={style.td}>{test.nameofTest}</td>
                            <td className={style.td}>{test.numOfQuestions}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={style.inkPFTestList}>
                <Link to="/pfresults_list" className={style.testResultsLink}>Test Results</Link>
                <Link to="/pf-statistics" className={style.testResultsLink}>Statistics</Link>
            </div>

            <h2>Questions</h2>
            <table className={style.table}>
                <thead>
                    <tr>
                        <th className={style.th}>Factor Letter</th>
                        <th className={style.th}>Question Number</th>
                        <th className={style.th}>Question Text</th>
                        <th className={style.th}>Choices</th>
                        <th className={style.th}>Equivalent Score</th>
                    </tr>
                </thead>
                <tbody>
                    {currentQuestions.map(q => (
                        <tr key={q.questionID}>
                            <td className={style.td}>{q.factorLetter}</td>
                            <td className={style.td}>{q.questionNum}</td>
                            <td className={style.td}>{q.questionText}</td>
                            <td className={style.td}>
                                A: {q.choices.a}<br />
                                B: {q.choices.b}<br />
                                C: {q.choices.c}
                            </td>
                            <td className={style.td}>
                                A: {q.choiceEquivalentScore.a}<br />
                                B: {q.choiceEquivalentScore.b}<br />
                                C: {q.choiceEquivalentScore.c}
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

export default PFTest;
