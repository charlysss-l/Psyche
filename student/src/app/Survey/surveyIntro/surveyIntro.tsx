import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './surveyIntro.module.scss';

const SurveyIntro = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/surveyDashboard');
  };

  return (
    <div className={styles.landingContainer}>
      <header className={styles.landingHeader}>
        <h1>Psychology Research Survey Hub</h1>
      </header>
      
      <div className={styles.landingDescription}>
        <p>
          Welcome to the Psychology Research Survey Hub — a dedicated platform where you can participate in surveys conducted by psychology students' researchers.
        </p>
        <p>
          Your valuable participation helps contribute to ongoing studies and discoveries in the field of psychology. Each survey is carefully designed following ethical guidelines, ensuring your responses remain confidential and your identity protected.
        </p>
      </div>

      <div className={styles.landingBenefits}>
        <h2>Why Participate?</h2>
        <ul>
          <li>Contribute to psychology research and student studies</li>
          <li>Help expand knowledge on human behavior and mental processes</li>
          <li>Support future psychologists in their academic work</li>
        </ul>
      </div>

      <div className={styles.landingAction}>
        <button className={styles.startButton} onClick={handleStartClick}>
          See Surveys
        </button>
      </div>
    </div>
  );
};

export default SurveyIntro;
