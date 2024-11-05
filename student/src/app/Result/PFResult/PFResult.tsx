import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface TestResultData {
    userID: string;
    firstName: string;
    lastName: string;
    age: string;
    sex: 'Male' | 'Female';
    courseSection: string;
    testType: 'Online' | 'Physical';
    responses: {
        questionID: string;
        selectedChoice: string;
        equivalentScore: number;
        factorLetter: string;
    }[];
    scoring: {
        factorLetter: string;
        rawScore: number;
        stenScore: number;
    }[];
}

const PFResult: React.FC = () => {
    const [results, setResults] = useState<TestResultData | null>(null);

    useEffect(() => {
        // Retrieve results from local storage
        const storedResults = localStorage.getItem('pfTestResults');
        if (storedResults) {
            setResults(JSON.parse(storedResults));
        }
    }, []);

    return (
        <div>
            {results ? (
                <div>
                    <h2>Test Results for {results.firstName} {results.lastName}</h2>
                    <p>User ID: {results.userID}</p>
                    <p>Age: {results.age}</p>
                    <p>Sex: {results.sex}</p>
                    <p>Course Section: {results.courseSection}</p>
                    <p>Test Type: {results.testType}</p>
                    <h3>Scoring Summary</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Factor Letter</th>
                                <th>Raw Score</th>
                                <th>Sten Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.scoring.map((score, index) => (
                                <tr key={index}>
                                    <td>{score.factorLetter}</td>
                                    <td>{score.rawScore}</td>
                                    <td>{score.stenScore}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h3>Responses</h3>
                    <ul>
                        {results.responses.map((response, index) => (
                            <li key={index}>
                                <p>Question ID: {response.questionID}</p>
                                <p>Selected Choice: {response.selectedChoice}</p>
                                <p>Equivalent Score: {response.equivalentScore}</p>
                                <p>Factor Letter: {response.factorLetter}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No results available. Please complete the test.</p>
            )}
        </div>
    );
};

export default PFResult;
