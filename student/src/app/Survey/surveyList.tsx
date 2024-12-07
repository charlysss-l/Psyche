// components/StudentDashboard.tsx
import React from "react";
import SurveyStudent from "./surveyStudent/surveyStudent";

const StudentDashboard: React.FC = () => {
  return (
    <div>
      <h1>Student Dashboard</h1>
      <SurveyStudent />
    </div>
  );
};

export default StudentDashboard;
