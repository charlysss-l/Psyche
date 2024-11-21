import React from 'react';
import styles from './homepage.module.scss';
import { Link } from 'react-router-dom'; // To navigate to other pages

const Home = () => {
  return (
    <div className={styles.homepagestudent}>
      <div className={styles.content}>
        <h1 className={styles.topHeader}>Discover Yourself | <Link to="/omr" className={styles.homeLink}> Interpret your test  →</Link></h1>
        <h1 className={styles.header}>Welcome to Your Student Portal</h1>
        <p className={styles.description}>
          Explore a wide range of tools and resources to help you succeed in your academic journey. 
          Discover more about yourself, track your progress, and unlock your potential.
        </p>
        <Link to="/test" className={styles.getStartedBtn}>Get Started</Link>
      </div>
    </div>
  );
};

export default Home;
