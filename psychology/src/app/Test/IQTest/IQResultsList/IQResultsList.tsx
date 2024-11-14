import React, { useState, useEffect } from 'react';
import styles from './page.module.scss'; // Import your CSS module

interface Response {
  questionID: string;
  selectedChoice: string;
  isCorrect: boolean;
}

interface Interpretation {
  ageRange: string;
  sex: 'Female' | 'Male';
  minTestScore: number;
  maxTestScore: number;
  percentilePoints: number;
  result: string;
}

interface UserIQTest {
  userID: string;
  firstName: string;
  lastName: string;
  age: number;
  sex: 'Female' | 'Male';
  testID: string;
  responses: Response[];
  totalScore: number;
  interpretation: Interpretation;
  testType: 'Online' | 'Physical';
  testDate: Date;
}

const IQResultsList: React.FC = () => {
  const [results, setResults] = useState<UserIQTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 8;

  // Fetch data from the server
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/useriq');
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();

      // Adding interpretation logic (as per student logic)
      const resultsWithInterpretation = data.data.map((result: UserIQTest) => {
        const interpretation = getInterpretation(result.age, result.totalScore);
        return { ...result, interpretation };
      });

      setResults(resultsWithInterpretation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getInterpretation = (age: number, score: number) => {
        
    //20-24 Age
    if (age >= 20 && age <= 24 && score == 0) {
        return { percentile: 0, result: 'Intellectually Impaired' };
    } else if (age >= 20 && age <= 24 && score >= 1 && score <= 23) {
        return { percentile: 5, result: 'Intellectually Impaired' };
    } else if (age >= 20 && age <= 24 && score >= 24 && score <= 28) {
        return { percentile: 10, result: 'Intellectually Impaired' };
    } else if (age >= 20 && age <= 24 && score >= 29 && score <= 37) {
        return { percentile: 25, result: 'Below Average In Intellectual Capacity' };
    } else if (age >= 20 && age <= 24 && score >= 38 && score <= 44) {
        return { percentile: 50, result: 'Intellectually Average' };
    } else if (age >= 20 && age <= 24 && score >= 45 && score <= 49) {
        return { percentile: 75, result: 'Above Average In Intellectual Capacity' };
    } else if (age >= 20 && age <= 24 && score >= 50 && score <= 54) {
        return { percentile: 90, result: 'Above Average In Intellectual Capacity' };
    } else if (age >= 20 && age <= 24 && score >= 55 && score <= 60) {
        return { percentile: 95, result: 'Intellectually Superior' };
    }

    //25-29 Age         
      else if (age >= 25 && age <= 29 && score == 0) {
        return { percentile: 0, result: 'Intellectually Impaired' };
    } else if (age >= 25 && age <= 29 && score >= 1 && score <= 23) {
        return { percentile: 5, result: 'Intellectually Impaired' };
    } else if (age >= 25 && age <= 29 && score >= 24 && score <= 28) {
        return { percentile: 10, result: 'Intellectually Impaired' };
    } else if (age >= 25 && age <= 29 && score >= 29 && score <= 37) {
        return { percentile: 25, result: 'Below Average In Intellectual Capacity' };
    } else if (age >= 25 && age <= 29 && score >= 38 && score <= 44) {
        return { percentile: 50, result: 'Intellectually Average' };
    } else if (age >= 25 && age <= 29 && score >= 45 && score <= 49) {
        return { percentile: 75, result: 'Above Average In Intellectual Capacity' };
    } else if (age >= 25 && age <= 29 && score >= 50 && score <= 54) {
        return { percentile: 90, result: 'Above Average In Intellectual Capacity' };
    } else if (age >= 25 && age <= 29 && score >= 55 && score <= 60) {
        return { percentile: 95, result: 'Intellectually Superior' };
    }

    //30-34 Age
      else if (age >= 30 && age <= 34 && score == 0) {
        return { percentile: 0, result: 'Intellectually Impaired' };
    } else if (age >= 30 && age <= 34 && score >= 1 && score <= 19) {
        return { percentile: 5, result: 'Intellectually Impaired' };
    } else if (age >= 30 && age <= 34 && score >= 20 && score <= 25) {
        return { percentile: 10, result: 'Intellectually Impaired' };
    } else if (age >= 30 && age <= 34 && score >= 26 && score <= 34) {
        return { percentile: 25, result: 'Below Average In Intellectual Capacity' };
    } else if (age >= 30 && age <= 34 && score >= 35 && score <= 42) {
        return { percentile: 50, result: 'Intellectually Average' };
    } else if (age >= 30 && age <= 34 && score >= 43 && score <= 47) {
        return { percentile: 75, result: 'Above Average In Intellectual Capacity' };
    } else if (age >= 30 && age <= 34 && score >= 48 && score <= 53) {
        return { percentile: 90, result: 'Above Average In Intellectual Capacity' };
    } else if (age >= 30 && age <= 34 && score >= 54 && score <= 60) {
        return { percentile: 95, result: 'Intellectually Superior' };
    }

    //35-39 Age
      else if (age >= 35 && age <= 39 && score == 0) {
        return { percentile: 0, result: 'Intellectually Impaired' };
    } else if (age >= 35 && age <= 39 && score >= 1 && score <= 30) {
        return { percentile: 25, result: 'Below Average In Intellectual Capacity' };
    } else if (age >= 35 && age <= 39 && score >= 31 && score <= 40) {
        return { percentile: 50, result: 'Intellectually Average' };
    } else if (age >= 35 && age <= 39 && score >= 41 && score <= 45) {
        return { percentile: 75, result: 'Above Average In Intellectual Capacity' };
    } else if (age >= 35 && age <= 39 && score >= 46 && score <= 52) {
        return { percentile: 90, result: 'Above Average In Intellectual Capacity' };
    } else if (age >= 35 && age <= 39 && score >= 53 && score <= 60) {
        return { percentile: 95, result: 'Intellectually Superior' };
    }

    //40-44 Age
      else if (age >= 40 && age <= 44 && score == 0) {
        return { percentile: 0, result: 'Intellectually Impaired' };
    } else if (age >= 40 && age <= 44 && score >= 1 && score <= 27) {
        return { percentile: 25, result: 'Below Average In Intellectual Capacity' };
    } else if (age >= 40 && age <= 44 && score >= 28 && score <= 38) {
        return { percentile: 50, result: 'Intellectually Average' };
    } else if (age >= 40 && age <= 44 && score >= 39 && score <= 43) {
        return { percentile: 75, result: 'Above Average In Intellectual Capacity' };
    } else if (age >= 40 && age <= 44 && score >= 44 && score <= 51) {
        return { percentile: 90, result: 'Above Average In Intellectual Capacity' };
    } else if (age >= 40 && age <= 44 && score >= 52 && score <= 60) {
        return { percentile: 95, result: 'Intellectually Superior' };
    }

    //45-49 Age
      else if (age >= 45 && age <= 49 && score == 0) {
        return { percentile: 0, result: 'Intellectually Impaired' };
    } else if (age >= 45 && age <= 49 && score >= 1 && score <= 24) {
        return { percentile: 25, result: 'Below Average In Intellectual Capacity' };
    } else if (age >= 45 && age <= 49 && score >= 25 && score <= 35) {
        return { percentile: 50, result: 'Intellectually Average' };
    } else if (age >= 45 && age <= 49 && score >= 36 && score <= 41) {
        return { percentile: 75, result: 'Above Average In Intellectual Capacity' };
    } else if (age >= 45 && age <= 49 && score >= 42 && score <= 49) {
        return { percentile: 90, result: 'Above Average In Intellectual Capacity' };
    } else if (age >= 45 && age <= 49 && score >= 50 && score <= 60) {
        return { percentile: 95, result: 'Intellectually Superior' };
    }

    //50-54 Age
      else if (age >= 50 && age <= 54 && score == 0) {
        return { percentile: 0, result: 'Intellectually Impaired' };
    } else if (age >= 50 && age <= 54 && score >= 1 && score <= 21) {
        return { percentile: 25, result: 'Below Average In Intellectual Capacity' };
    } else if (age >= 50 && age <= 54 && score >= 22 && score <= 33) {
        return { percentile: 50, result: 'Intellectually Average' };
    } else if (age >= 50 && age <= 54 && score >= 34 && score <= 39) {
        return { percentile: 75, result: 'Above Average In Intellectual Capacity' };
    } else if (age >= 50 && age <= 54 && score >= 40 && score <= 47) {
        return { percentile: 90, result: 'Above Average In Intellectual Capacity' };
    } else if (age >= 50 && age <= 54 && score >= 48 && score <= 60) {
        return { percentile: 95, result: 'Intellectually Superior' };
    }

    //55-59 Age
      else if (age >= 55 && age <= 59 && score == 0) {
        return { percentile: 0, result: 'Intellectually Impaired' };
    } else if (age >= 55 && age <= 59 && score >= 1 && score <= 18) {
        return { percentile: 25, result: 'Below Average In Intellectual Capacity' };
    } else if (age >= 55 && age <= 59 && score >= 19 && score <= 30) {
        return { percentile: 50, result: 'Intellectually Average' };
    } else if (age >= 55 && age <= 59 && score >= 31 && score <= 37) {
        return { percentile: 75, result: 'Above Average In Intellectual Capacity' };
    } else if (age >= 55 && age <= 59 && score >= 38 && score <= 45) {
        return { percentile: 90, result: 'Above Average In Intellectual Capacity' };
    } else if (age >= 55 && age <= 59 && score >= 46 && score <= 60) {
        return { percentile: 95, result: 'Intellectually Superior' };
    }

    //60-64 Age
      else if (age >= 60 && age <= 64 && score == 0) {
        return { percentile: 0, result: 'Intellectually Impaired' };
    } else if (age >= 60 && age <= 64 && score >= 1 && score <= 15) {
        return { percentile: 25, result: 'Below Average In Intellectual Capacity' };
    } else if (age >= 60 && age <= 64 && score >= 16 && score <= 27) {
        return { percentile: 50, result: 'Intellectually Average' };
    } else if (age >= 60 && age <= 64 && score >= 28 && score <= 35) {
        return { percentile: 75, result: 'Above Average In Intellectual Capacity' };
    } else if (age >= 60 && age <= 64 && score >= 36 && score <= 43) {
        return { percentile: 90, result: 'Above Average In Intellectual Capacity' };
    } else if (age >= 60 && age <= 64 && score >= 44 && score <= 60) {
        return { percentile: 95, result: 'Intellectually Superior' };
    }

    //65 Age and above
      else if (age >= 65 && score == 0) {
        return { percentile: 0, result: 'Intellectually Impaired' };
    } else if (age >= 65 && score >= 1 && score <= 13) {
        return { percentile: 25, result: 'Below Average In Intellectual Capacity' };
    } else if (age >= 65 && score >= 14 && score <= 24) {
        return { percentile: 50, result: 'Intellectually Average' };
    } else if (age >= 65 && score >= 25 && score <= 33) {
        return { percentile: 75, result: 'Above Average In Intellectual Capacity' };
    } else if (age >= 65 && score >= 34 && score <= 41) {
        return { percentile: 90, result: 'Above Average In Intellectual Capacity' };
    } else if (age >= 65 && score >= 42 && score <= 60) {
        return { percentile: 95, result: 'Intellectually Superior' };
    }
};


  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.errorMessage}>Error: {error}</div>;

  // Calculate the total number of pages
  const totalPages = Math.ceil(results.length / resultsPerPage);

  // Slice results based on the current page
  const currentResults = results.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  return (
    <div>
      <h2>IQ Results List</h2>
      {results.length > 0 ? (
        <div>
          <table className={styles.resultsTableIQ}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Sex</th>
                <th>Test Type</th>
                <th>Test Date</th>
                <th>Responses</th>
                <th>Total Score</th>
                <th>Interpretation</th>
              </tr>
            </thead>

            <tbody>
              {currentResults.map((result) => (
                <tr key={result.userID} className={styles.eachResultIQ}>
                  <td>{result.firstName} {result.lastName}</td>
                  <td>{result.age}</td>
                  <td>{result.sex}</td>
                  <td>{result.testType}</td>
                  <td>{new Date(result.testDate).toLocaleDateString()}</td>
                  <td>
                    <table>
                      <thead>
                        <tr>
                          <th>Question ID</th>
                          <th>Selected Choice</th>
                          <th>Correct</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.responses.map((response, index) => (
                          <tr key={index}>
                            <td>{response.questionID}</td>
                            <td>
                              <img
                                className={styles['selected-choice-img']}
                                src={response.selectedChoice}
                                alt={`Choice ${index + 1}`}
                              />
                            </td>
                            <td>{response.isCorrect ? 'Correct' : 'Incorrect'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                  <td>{result.totalScore}</td>
                  <td>
                    <ul>
                     
                      <li>Score: {result.totalScore}</li>
                      <li>Interpretation: {result.interpretation.result}</li>
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className={styles.pagination}>
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
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default IQResultsList;
