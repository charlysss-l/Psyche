// components/SurveyAnswerForm.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './surveyStudent.module.scss';  // Import the SCSS module

interface Survey {
  _id: string;
  title: string;
  description: string;
  questions: {
    _id: string;
    questionText: string;
    choices: string[];
  }[];
}

const SurveyAnswerForm: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<any>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const surveysPerPage = 5;  // Number of surveys to display per page

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/surveys');  // Correct URL
        setSurveys(response.data);
      } catch (error) {
        console.error('Error fetching surveys', error);
      }
    };
    fetchSurveys();
  }, []);

  const handleAnswerChange = (surveyId: string, questionId: string, choice: string) => {
    setSelectedAnswers((prevState: any) => ({
      ...prevState,
      [surveyId]: {
        ...prevState[surveyId],
        [questionId]: choice,
      },
    }));
  };

  const handleSubmit = async (surveyId: string) => {
    const studentId = localStorage.getItem("studentId");  // Retrieve studentId from localStorage
    if (!studentId) {
      alert("You need to be logged in to submit the survey.");
      return;
    }

    const responses = Object.keys(selectedAnswers[surveyId] || {}).map((questionId) => ({
      questionId,
      choice: selectedAnswers[surveyId][questionId],
    }));

    try {
      await axios.post('http://localhost:5000/api/response/surveys/submit', {
        studentId,  // Send studentId to the backend
        surveyId,
        responses,
      });
      alert('Survey submitted successfully');
    } catch (error) {
      alert('Error submitting survey');
      console.error(error);
    }
  };

  const indexOfLastSurvey = currentPage * surveysPerPage;
  const indexOfFirstSurvey = indexOfLastSurvey - surveysPerPage;
  const currentSurveys = surveys.slice(indexOfFirstSurvey, indexOfLastSurvey);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className={styles.surveyFormContainer}>
      <h2>Available Surveys <span className={styles.surveyCount}>({surveys.length})</span></h2> {/* Display count here */}
      {currentSurveys.map((survey) => (
        <div key={survey._id} className={styles.survey}>
          <h3 className={styles.title}>{survey.title}</h3>
          <p className={styles.description}>{survey.description}</p>
          {survey.questions.map((question) => (
            <div key={question._id} className={styles.question}>
              <p>{question.questionText}</p>
              {question.choices.map((choice, index) => (
                <label key={index}>
                  <input
                    type="radio"
                    name={`question-${question._id}`}
                    value={choice}
                    onChange={() => handleAnswerChange(survey._id, question._id, choice)}
                  />
                  {choice}
                </label>
              ))}
            </div>
          ))}
          <button className={styles.submitButton} onClick={() => handleSubmit(survey._id)}>Submit Survey</button>
        </div>
      ))}
      
      <div className={styles.pagination}>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastSurvey >= surveys.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SurveyAnswerForm;
