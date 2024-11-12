import React, { Key, useEffect, useState } from 'react';
import axios from 'axios';
import styles from './surveyResponseList.module.scss';  // Import the SCSS module

interface SurveyResponse {
  _id: Key | null | undefined;
  studentId: {
    userId: string; // Display student ID instead of email
  };
  surveyId: {
    title: string;
    questions: {
      _id: any;
      questionText: string; // Each question in the survey
      choices: string[];     // The choices for each question
    }[]; 
  };
  responses: {
    questionId: string; // Store as ObjectId (not questionText directly)
    choice: string;     // The answer/choice given
  }[];
  submittedAt: string;
}

const SurveyResponseList: React.FC = () => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const responsesPerPage = 5;  // Number of responses to display per page

  useEffect(() => {
    const fetchSurveyResponses = async () => {
      try {
        const surveyId = ''; // Leave empty to get all responses
        const response = await axios.get('http://localhost:5000/api/survey-responses', {
          params: { surveyId },
        });
        setResponses(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching survey responses:', error);
        setLoading(false);
      }
    };

    fetchSurveyResponses();
  }, []);

  const indexOfLastResponse = currentPage * responsesPerPage;
  const indexOfFirstResponse = indexOfLastResponse - responsesPerPage;
  const currentResponses = responses.slice(indexOfFirstResponse, indexOfLastResponse);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return <div>Loading responses...</div>;
  }

  return (
    <div className={styles.responseListContainer}>
      <h2>
        Survey Responses <span className={styles.responseCount}>({responses.length} responses)</span>
      </h2>
      {responses.length === 0 ? (
        <p>No responses available.</p>
      ) : (
        <table className={styles.responseTable}>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Survey Title</th>
              <th>Questions and Answers</th>
              <th>Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {currentResponses.map((response) => (
              <tr key={response._id}>
                <td>{response.studentId.userId}</td>
                <td>{response.surveyId.title}</td>
                <td>
                  {response.surveyId.questions.map((question, index) => {
                    const answer = response.responses.find(
                      (response) => response.questionId.toString() === question._id.toString()
                    );
                    return (
                      <div key={index}>
                        <strong>{question.questionText}: </strong>
                        {answer ? answer.choice : 'No answer'}
                      </div>
                    );
                  })}
                </td>
                <td>{new Date(response.submittedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className={styles.pagination}>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastResponse >= responses.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SurveyResponseList;
