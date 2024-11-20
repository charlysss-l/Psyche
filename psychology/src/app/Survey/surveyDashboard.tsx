import React from 'react';
import SurveyForm from './survey';
import SurveyList from './surveyList';
import SurveyResponseList from './surveyResponseList';
import styles from './surveyDashboard.module.scss'
const SurveyDashboard: React.FC = () => {
  return (
    <div>
      <h1 className={styles.survDt}>Survey Dashboard</h1>
      <SurveyList />
    </div>
  );
};

export default SurveyDashboard;
