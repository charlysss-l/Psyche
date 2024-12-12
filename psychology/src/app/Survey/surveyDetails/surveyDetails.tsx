import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./surveyDetails.module.scss";
import backendUrl from "../../../config";

// SurveyDetails component to fetch and display survey details
const SurveyDetails: React.FC = () => {
    // Extract survey id from URL params using useParams hook
  const { id } = useParams<{ id: string }>();
    // Define state to hold survey details
  const [survey, setSurvey] = useState<any>(null);
  // useEffect hook to fetch survey details when component mounts or id changes
  useEffect(() => {
    const fetchSurveyDetails = async () => {
      try {         // Fetch survey details from API using axios
        const response = await axios.get(`${backendUrl}/api/surveys/${id}`);
        setSurvey(response.data);
      } catch (error) {
        console.error("Error fetching survey details", error);
      }
    };
    fetchSurveyDetails();
  }, [id]);

  if (!survey) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.surveyDetailsContainer}>
      <h1 className={styles.surveyh1Title}>{survey.title}</h1>
      <p>{survey.description}</p>
      <h4>Category: {survey.category}</h4>
      <h5>Release Date: {survey.releaseDate}</h5>
      {survey.sections.map((section: any, sectionIndex: number) => (
        <div key={sectionIndex} className={styles.sectionContainer}>
          <h3>Section: {section.sectionTitle}</h3>
          {section.questions.map((question: any, questionIndex: number) => (
            <div key={questionIndex} className={styles.questionList}>
              <div className={styles.questionItem}>
                <strong>Question: {question.questionText}</strong>
                {question.choices && question.choices.length > 0 ? (
                  <>
                    <table className={styles.choicesTable}>
                      <thead>
                        <tr>
                          <th>Choice</th>
                        </tr>
                      </thead>
                      <tbody>
                        {question.choices.map((choice: string, choiceIndex: number) => (
                          <tr key={choiceIndex}>
                            <td>{choice}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <p>No choices available.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SurveyDetails;
