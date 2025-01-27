import React from "react";
import { Link } from "react-router-dom";
import styles from "./Landing.module.scss";

const LandingPage: React.FC = () => {
  return (
    <div className={styles.landing_page}>
      {/* Main Content */}

      <div className={styles.content}>
        <div className={styles.logo}></div>
        <h2 className={styles.landing_page_subheader}>
          Welcome to Your Personal Growth Journey
        </h2>
        <p className={styles.landing_page_description}>
          Our platform is designed to help you unlock your full potential.
          Whether you’re looking for standardized tests, advanced analytics, or
          receive proper guidance, we’ve got you covered.
        </p>
        <p className={styles.landing_page_extra_description}>
          With the collaboration of the Psychology Program, join us to discover
          yourself more deeply using our intuitive and powerful tools.
        </p>
        <Link to="/login" className={styles.get_started_btn}>
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
