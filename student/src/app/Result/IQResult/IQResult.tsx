import React, { useEffect, useState } from 'react';

interface IQTestResultData {
    userID: string;
    firstName: string;
    lastName: string;
    age: number;
    sex: 'Male' | 'Female';
    testType: 'Online' | 'Physical';
    totalScore: number;
    interpretation?: {
        percentile: number;
        result: string;
    };
}

const IQResult: React.FC = () => {
    const [result, setResult] = useState<IQTestResultData | null>(null);

    useEffect(() => {
        // Retrieve results from local storage
        const storedResults = localStorage.getItem('iqTestResults');
        if (storedResults) {
            const parsedResults: IQTestResultData = JSON.parse(storedResults);
            
            // Calculate interpretation based on age and score
            const interpretation = getInterpretation(parsedResults.age, parsedResults.totalScore);
            setResult({ ...parsedResults, interpretation });
        }
    }, []);

    const getInterpretation = (age: number, score: number) => {
        if (age >= 20 && age <= 24 && score <= 3) {
            return { percentile: 5, result: 'Intellectually Impaired' };
        } else if (age >= 20 && age <= 24 && score >= 4) {
            return { percentile: 100, result: 'Intelligent' };
        } else {
            return { percentile: 50, result: 'Average' }; // Default interpretation
        }
    };

    return (
        <div>
            {result ? (
                <div>
                    <h2>IQ Test Results for {result.firstName} {result.lastName}</h2>
                    <p>User ID: {result.userID}</p>
                    <p>Age: {result.age}</p>
                    <p>Sex: {result.sex}</p>
                    <p>Test Type: {result.testType}</p>
                    <h3>Score</h3>
                    <p>Total Score: {result.totalScore}</p>
                    {result.interpretation && (
                        <>
                            <h3>Interpretation</h3>
                            <p>Percentile: {result.interpretation.percentile}%</p>
                            <p>Interpretation: {result.interpretation.result}</p>
                        </>
                    )}
                </div>
            ) : (
                <p>No results available. Please complete the test.</p>
            )}
        </div>
    );
};

export default IQResult;
