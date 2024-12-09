import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ArchivedSurveys.module.scss";

//Uses axios to fetch survey data from an API endpoint.
//Manages survey data, loading status, and error messages using React's useState.
//
interface ArchivedSurvey {
  _id: string;
  surveyId: string;
  userId: string;
  responses: { questionId: string; choice: string }[];
  submittedAt: string;
}

const ArchivedSurveys: React.FC = () => {
  const [archivedSurveys, setArchivedSurveys] = useState<ArchivedSurvey[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Retrieve the user ID from localStorage. Replace with your own logic if needed.
  const userId = localStorage.getItem("userId"); // Replace this with your logic to get the logged-in user's ID
  
  // Fetch archived surveys when the component mounts or when the userId changes.
  useEffect(() => {
    const fetchArchivedSurveys = async () => {
      if (!userId) {
        setError("User is not logged in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/response/archived-surveys/${userId}`
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
        <table className={styles.surveyTable}>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Survey ID</th>
              <th>Submitted At</th>
              <th>Responses</th>
            </tr>
          </thead>
          <tbody>
            {archivedSurveys.length === 0 ? (
              <tr>
                <td colSpan={4} className={styles.noResponses}>
                  No Responses Yet
                </td>
              </tr>
            ) : (
              archivedSurveys.map((survey) => (
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
