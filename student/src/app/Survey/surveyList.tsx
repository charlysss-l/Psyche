// components/StudentDashboard.tsx
import React from 'react';
import SurveyAnswerForm from './surveyStudent';

const StudentDashboard: React.FC = () => {
  return (
    <div>
      <h1>Student Dashboard</h1>
      <SurveyAnswerForm />
    </div>
  );
};

export default StudentDashboard;
