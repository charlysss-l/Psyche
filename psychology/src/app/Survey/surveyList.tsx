// components/SurveyList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './surveyList.module.scss';  // Import the SCSS module

const SurveyList: React.FC = () => {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const surveysPerPage = 5;  // Number of surveys to display per page

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/surveys');
        setSurveys(response.data);
      } catch (error) {
        console.error('Error fetching surveys', error);
      }
    };
    fetchSurveys();
  }, []);

  const indexOfLastSurvey = currentPage * surveysPerPage;
  const indexOfFirstSurvey = indexOfLastSurvey - surveysPerPage;
  const currentSurveys = surveys.slice(indexOfFirstSurvey, indexOfLastSurvey);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className={styles.surveyListContainer}>
      <h2>
        Available Surveys <span className={styles.surveyCount}>({surveys.length} surveys)</span>
      </h2>
      {currentSurveys.map((survey) => (
        <div key={survey._id} className={styles.surveyCard}>
          <h3>{survey.title}</h3>
          <p>{survey.description}</p>
          <ul className={styles.questionList}>
            {survey.questions.map((question: any, index: number) => (
              <li key={index} className={styles.questionItem}>
                {question.questionText}
                <ul className={styles.choiceList}>
                  {question.choices.map((choice: string, idx: number) => (
                    <li key={idx} className={styles.choiceItem}>{choice}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
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

export default SurveyList;
