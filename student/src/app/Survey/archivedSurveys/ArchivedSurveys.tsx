import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ArchivedSurveys.module.scss";
import backendUrl from "../../../config";

interface ArchivedSurvey {
  _id: string;
  surveyId: string;
  userId: string;
  responses: { questionId: string; choice: string }[];
  submittedAt: string;
}

const ArchivedSurveys: React.FC = () => {
  const [archivedSurveys, setArchivedSurveys] = useState<ArchivedSurvey[]>([]);
  const [hiddenSurveys, setHiddenSurveys] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const userId = localStorage.getItem("userId");

  // Load hidden surveys from localStorage on mount
  useEffect(() => {
    const storedHiddenSurveys = localStorage.getItem("hiddenSurveys");
    if (storedHiddenSurveys) {
      setHiddenSurveys(new Set(JSON.parse(storedHiddenSurveys)));
    }
  }, []);

  useEffect(() => {
    const fetchArchivedSurveys = async () => {
      if (!userId) {
        setError("User is not logged in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${backendUrl}/api/response/archived-surveys/${userId}`
        );
        setArchivedSurveys(response.data);
      } catch (err) {
        console.error("Error fetching archived surveys:", err);
        setError("Failed to load archived surveys.");
      } finally {
        setLoading(false);
      }
    };

    fetchArchivedSurveys();
  }, [userId]);

  // Hide a single survey
  const handleRemove = (surveyId: string) => {
    setHiddenSurveys((prev) => {
      const updatedHidden = new Set(prev);
      updatedHidden.add(surveyId);
      localStorage.setItem("hiddenSurveys", JSON.stringify(Array.from(updatedHidden)));
      return updatedHidden;
    });
  };

  // Hide all surveys at once
  const handleClearAll = () => {
    const allSurveyIds = archivedSurveys.map((survey) => survey._id);
    setHiddenSurveys(new Set(allSurveyIds));
    localStorage.setItem("hiddenSurveys", JSON.stringify(allSurveyIds));
  };

  if (loading) {
    return <p>Loading archived surveys...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.floatingContainer}>
        <div className={styles.archivedSurveysContainer}>
          <h2>Archived Surveys</h2>
          <button
            className={styles.clearAllButton}
            onClick={handleClearAll}
            disabled={archivedSurveys.length === 0}
          >
            Clear All Responses
          </button>
          <table className={styles.surveyTable}>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Survey ID</th>
                <th>Submitted At</th>
                <th>Responses</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {archivedSurveys.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.noResponses}>
                    No Responses Yet
                  </td>
                </tr>
              ) : (
                archivedSurveys
                  .filter((survey) => !hiddenSurveys.has(survey._id)) // Hide surveys
                  .map((survey) => (
                    <tr key={survey._id}>
                      <td>{survey.userId}</td>
                      <td>{survey.surveyId}</td>
                      <td>{new Date(survey.submittedAt).toLocaleString()}</td>
                      <td>
                        {survey.responses.length > 0 ? (
                          survey.responses.map((response, index) => (
                            <div key={index}>
                              <strong>Answer:</strong> {response.choice}
                            </div>
                          ))
                        ) : (
                          <p>No responses</p>
                        )}
                      </td>
                      <td>
                        <button
                          className={styles.removeButton}
                          onClick={() => handleRemove(survey._id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ArchivedSurveys;
