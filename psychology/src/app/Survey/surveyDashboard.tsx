import React from 'react';
import SurveyForm from './survey';
import SurveyList from './surveyList';
import SurveyResponseList from './surveyResponseList';

const SurveyDashboard: React.FC = () => {
  return (
    <div>
      <h1>Survey Dashboard</h1>
      <SurveyForm />
      <SurveyList />
      <SurveyResponseList />
    </div>
  );
};

export default SurveyDashboard;
