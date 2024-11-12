import React from 'react';
import styles from './Landing.module.scss';  // Import styles
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Navigate to the login page
    navigate('/login');
  };

  return (
    <div className={styles['landing-page']}>
      <h1 className={styles['landing-page-header']}>Discover U</h1>
      <h2 className={styles['landing-page-subheader']}>Welcome to Our Platform</h2>
      <p className={styles['landing-page-description']}>Experience the best service tailored just for you!</p>
      <button onClick={handleGetStarted} className={styles['get-started-btn']}>
        Get Started
      </button>
    </div>
  );
};

export default LandingPage;
