// components/SurveyList.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./surveyList.module.scss"; // SCSS module for styling
import {Link} from "react-router-dom";

const SurveyList: React.FC = () => {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const surveysPerPage = 5; // Number of surveys to display per page

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/surveys");
        setSurveys(response.data);
      } catch (error) {
        console.error("Error fetching surveys", error);
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
      <div className={styles.linkSurveyChoices}>
      <Link to="/survey-form" className={styles.createsurveyButton}> Create Survey</Link>
      <Link to="/survey-response-list" className={styles.createsurveyButton}> Response List</Link>
      </div>
     
      <h2>
        Available Surveys{" "}
        <span className={styles.surveyCount}>({surveys.length} surveys)</span>
      </h2>
      {currentSurveys.map((survey) => (
        <div key={survey._id} className={styles.surveyCard}>
          <h3>{survey.title}</h3>
          <p>{survey.description}</p>
          {survey.sections.map((section: any, sectionIndex: number) => (
            <div key={sectionIndex} className={styles.sectionContainer}>
              <h4>{section.sectionTitle}</h4>
              <ul className={styles.questionList}>
                {section.questions.map(
                  (question: any, questionIndex: number) => (
                    <li key={questionIndex} className={styles.questionItem}>
                      <strong>{question.questionText}</strong>
                      <ul className={styles.choiceList}>
                        {question.choices.map(
                          (choice: string, choiceIndex: number) => (
                            <li key={choiceIndex} className={styles.choiceItem}>
                              {choice}
                            </li>
                          )
                        )}
                      </ul>
                    </li>
                  )
                )}
              </ul>

              {/*<Link to="/survey-response-list"> Response List</Link>*/}
            </div>
          ))}
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
