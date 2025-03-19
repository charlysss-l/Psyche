import React, { useEffect } from 'react';
import styles from './homepage.module.scss';
import { Link } from 'react-router-dom';

// Importing image assets for the homepage visuals
const fallGuy = require('../../images/fallGuy.png');
const fallGirl = require('../../images/fallGirl.png');
const lappy = require('../../images/lappy.png');
const testPaper = require('../../images/testPaper.png');
const pen = require('../../images/pen.png');

const Home = () => {
  useEffect(() => {
    // Set viewport for zoom-out effect
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) {
      metaViewport.setAttribute("content", "width=device-width, initial-scale=0.8, maximum-scale=1.0");
    } else {
      const newMeta = document.createElement("meta");
      newMeta.name = "viewport";
      newMeta.content = "width=device-width, initial-scale=0.8, maximum-scale=1.0";
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
    <div className={styles.homepage}>
      <section className={styles.homepagestudent}>
        <img src={fallGuy} alt="Fall Guy" className={styles.fallGuy} />
        <img src={fallGirl} alt="Fall Girl" className={styles.fallGirl} />
        <img src={lappy} alt="Laptop" className={styles.lappy} />
        <img src={testPaper} alt="Test Paper" className={styles.testPaper} />
        <img src={pen} alt="Pen" className={styles.pen} />
        <div className={styles.content}>
          <h1 className={styles.topHeader}>
            Discover Yourself | <Link to="/omr" className={styles.homeLink}> Interpret your test →</Link>
          </h1>
          <h1 className={styles.header}>Welcome to Your Student Portal</h1>
          <p className={styles.description}>
            Explore a wide range of tools and resources to help you succeed in your academic journey. 
            Discover more about yourself, track your progress, and unlock your potential.
          </p>
          <Link to="/test" className={styles.getStartedBtn}>Get Started</Link>
        </div>
      </section>

      <section className={styles.homepageconsultation}>
        <div className={styles.contentconsultation}>
          <h1 className={styles.headerconsultation}>Guidance Consultation Available</h1>
          <div className={styles.contentLayout}>
            <p className={styles.descriptionconsultation}>
              Book a session with our school guidance team to review your Test results and gain valuable insights. 
              <br/><br/> We also offer consultations tailored to your needs, including academic, career, and personal development support.
            </p>
            <div className={styles.picConsultation}></div>
          </div>
          <Link to="/consultation" className={styles.getStartedBtn}>Schedule Now!</Link>
        </div>
      </section>

      <section className={styles.homepagesurvey}>
        <div className={styles.contentsurvey}>
          <h1 className={styles.headersurvey}>Explore and Answer Surveys</h1>
          <div className={styles.contentLayoutsurvey}>
            <div className={styles.picSurvey}></div>
            <p className={styles.descriptionsurvey}>
              Explore a variety of surveys tailored to your needs and interests. Categorized for convenience, our platform allows students to easily find and respond to surveys, making your opinions count and contributing to meaningful insights.
            </p>
          </div>
          <Link to="/consultation" className={styles.getStartedBtnSurvey}>Answer Now!</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
