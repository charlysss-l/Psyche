// components/StudentDashboard.tsx
import React from "react";
import { useEffect } from "react";
import SurveyStudent from "./surveyStudent/surveyStudent";

const StudentDashboard: React.FC = () => {

    useEffect(() => {
        // Set viewport for zoom-out effect
        const metaViewport = document.querySelector('meta[name="viewport"]');
        if (metaViewport) {
          metaViewport.setAttribute("content", "width=device-width, initial-scale=0.65, maximum-scale=1.0, user-scalable=no");
        } else {
          const newMeta = document.createElement("meta");
          newMeta.name = "viewport";
          newMeta.content = "width=device-width, initial-scale=0.8, maximum-scale=1.0, user-scalable=no";
          document.head.appendChild(newMeta);
        }
    
        // Cleanup function to reset viewport when leaving the page
        return () => {
          if (metaViewport) {
            metaViewport.setAttribute("content", "width=device-width, initial-scale=1.0");
          }
        };
      }, []);

  return (
    <div>
      <h1></h1>
      <SurveyStudent />
    </div>
  );
};

export default StudentDashboard;
