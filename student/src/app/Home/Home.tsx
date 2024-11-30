import React from 'react';
import styles from './homepage.module.scss';
import { Link } from 'react-router-dom'; // To navigate to other pages

const fallGuy = require('../../images/fallGuy.png');
const fallGirl = require('../../images/fallGirl.png');
const lappy = require('../../images/lappy.png');
const testPaper = require('../../images/testPaper.png');
const pen = require('../../images/pen.png');

const Home = () => {
  return (
    <div className={styles.homepagestudent}>
      <img src={fallGuy} alt="Fall Guy" className={styles.fallGuy}/>
        <img src={fallGirl} alt="Fall Girl" className={styles.fallGirl} />
        <img src={lappy} alt="Laptop" className={styles.lappy} />
        <img src={testPaper} alt="Test Paper" className={styles.testPaper}/>
        <img src={pen} alt="Pen" className={styles.pen}/>
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
