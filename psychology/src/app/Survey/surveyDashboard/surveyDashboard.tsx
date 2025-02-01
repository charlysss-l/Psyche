import React from "react";
import SurveyForm from "../survey/survey";
import SurveyList from "../surveyList/surveyList";
import styles from "./surveyDashboard.module.scss";
const SurveyDashboard: React.FC = () => {
  return (
    <div>
      <h1 className={styles.survDt}></h1>
      <SurveyList />
    </div>
  );
};

export default SurveyDashboard;
