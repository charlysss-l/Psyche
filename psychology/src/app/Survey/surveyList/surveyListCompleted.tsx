import React, { useState } from "react";
import styles from "./surveyList.module.scss";
import { Link } from "react-router-dom";
import axios from "axios";
import backendUrl from "../../../config";

interface CompletedSurveysModalProps {
  completedSurveys: any[];
  onClose: () => void;
}

const ITEMS_PER_PAGE = 5;

// Handler for removing a survey
const handleDeleteSurvey = async (surveyId: string) => {
  if (window.confirm("Are you sure you want to conclude this survey?")) {
    try {
      await axios.delete(`${backendUrl}/api/surveys/${surveyId}`);
      alert("Survey concluded successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error concluding survey", error);
      alert("Failed to conclude the survey.");
    }
  }
};

const CompletedSurveysModal: React.FC<CompletedSurveysModalProps> = ({ completedSurveys, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(completedSurveys.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSurveys = completedSurveys.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const nextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Completed Surveys</h2>
        <p>Total Completed Surveys: {completedSurveys.length}</p>
        {paginatedSurveys.map((survey) => (
          <div key={survey._id} className={styles.surveysCard}>
            <h3>{survey.title}</h3>
            <p>Description: {survey.description}</p>
            <p>Category: {survey.category}</p>
            <p>Release Date: {new Date(survey.releaseDate).toLocaleDateString()}</p>
            <div className={styles.surveyActions}>
              <Link to={`/survey-details/${survey._id}`} className={styles.viewDetailsButton}>
                View Details
              </Link>
              <button onClick={() => handleDeleteSurvey(survey._id)} className={styles.deleteButton}>
                Delete
              </button>
              <Link to={`/survey-responses/${survey._id}`} className={styles.viewDetailsButton}>
                Responses List
              </Link>
            </div>
          </div>
        ))}
        <div className={styles.pagination}>
          <button onClick={prevPage} disabled={currentPage === 1} className={styles.pageButton}>
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={nextPage} disabled={currentPage === totalPages} className={styles.pageButton}>
            Next
          </button>
        </div>
        <button onClick={onClose} className={styles.closeButton}>
          Close
        </button>
      </div>
    </div>
  );
};

export default CompletedSurveysModal;
