import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ArchivedSurveys.module.scss";

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

  const userId = localStorage.getItem("userId"); // Replace this with your logic to get the logged-in user's ID

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

  if (archivedSurveys.length === 0) {
    return <p>No archived surveys found.</p>;
  }

  return (
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
          {archivedSurveys.map((survey) => (
            <tr key={survey._id}>
              <td>{survey.userId}</td>
              <td>{survey.surveyId}</td>
              <td>{new Date(survey.submittedAt).toLocaleString()}</td>
              <td> {survey.responses.map((response) => (
<td>                      <strong>Answer:</strong> {response.choice}
                    </td>
                  ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default ArchivedSurveys;
