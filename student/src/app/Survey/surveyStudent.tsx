import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./surveyStudent.module.scss";
import { Link } from "react-router-dom";

interface Survey {
  _id: string;
  title: string;
  description: string;
  category: string;
  releaseDate: string;
  filters: { field: string; options: string }[];
}

const SurveyAnswerForm: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const surveysPerPage = 5;

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
      <h2>
        Available Surveys{" "}
        <span className={styles.surveyCount}>({surveys.length} surveys)</span>
      </h2>

      {currentSurveys.map((survey) => (
        <div key={survey._id} className={styles.surveyCard}>
          <h3>{survey.title}</h3>
          <p>Description: {survey.description}</p>
          <p>Category: {survey.category}</p>
          <p>Release Date: {survey.releaseDate}</p>
          <div className={styles.filters}>
            <h4>Participant Filters:</h4>
            <table>
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                {survey.filters.map(
                  (filter: { field: string; options: string }, index: number) => (
                    <tr key={index}>
                      <td>{filter.field}</td>
                      <td>{filter.options}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          <div className={styles.surveyActions}>
            <Link
              to={`/survey-details/${survey._id}`}
              className={styles.viewDetailsButton}
            >
              View Details
            </Link>
          </div>
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
