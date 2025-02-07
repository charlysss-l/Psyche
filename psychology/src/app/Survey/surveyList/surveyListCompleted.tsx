import React from "react";
import styles from "./surveyList.module.scss";
import { Link } from "react-router-dom";
import axios from "axios";
import backendUrl from "../../../config";


interface CompletedSurveysModalProps {
  completedSurveys: any[];
  onClose: () => void;
}

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
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Completed Surveys</h2>
        {completedSurveys.map((survey) => (
          <div key={survey._id} className={styles.surveysCard}>
            <h3>{survey.title}</h3>
            <p>Description: {survey.description}</p>
            <p>Category: {survey.category}</p>
            <p>Release Date: {new Date(survey.releaseDate).toLocaleDateString()}</p>
            <div className={styles.surveyActions}>
            <Link
              to={`/survey-details/${survey._id}`}
              className={styles.viewDetailsButton}
            >
              View Details
            </Link>
            <button
              onClick={() => handleDeleteSurvey(survey._id)}
              className={styles.deleteButton}
            >
              Delete
            </button>
            <Link
              to={`/survey-responses/${survey._id}`}
              className={styles.viewDetailsButton}
            >
              Responses List
            </Link>
          </div>
          </div>
        ))}
        <button onClick={onClose} className={styles.closeButton}>
          Close
        </button>
      </div>
    </div>
  );
};

export default CompletedSurveysModal;