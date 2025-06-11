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
    Welcome to the Psychology Research Survey Hub — a dedicated platform where you can create and manage surveys for psychology research studies.
  </p>
  <p>
    This platform allows you, as a researcher or admin, to easily build surveys, collect responses, and monitor data for your academic or research projects. All surveys follow ethical standards, ensuring participant confidentiality and data protection.
  </p>
</div>

<div className={styles.landingBenefits}>
  <h2>Why Use This Platform?</h2>
  <ul>
    <li>Easily create and customize surveys for your research</li>
    <li>Securely collect and manage participant responses</li>
    <li>Analyze data efficiently to support your studies</li>
    <li>Maintain confidentiality and ethical research standards</li>
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
