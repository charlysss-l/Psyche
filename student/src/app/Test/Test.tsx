import React from 'react';
import { Link } from 'react-router-dom';
import style from './studentpftest.module.scss';

const Test = () => {
  return (
    <div className={style.TestContent}>
      <h1>List of Standardized Test</h1>
      <div className={style.ListTest}>
        <div className={style.TestPF}>
          <Link to="/intro-pf" className={style.pfLink}>
            Catell's 16 Personality Factor Questionnaire
          </Link>
        </div>
        <div className={style.iqLinkContainer}>
          <Link to="/intro-iq" className={style.iqLink}>
           Raven’s Standard Progressive Matrices
          </Link>
        </div>
        <div className={style.iqLinkContainer}>
          <Link to="/intro-cf" className={style.iqLink}>
           Measuring Intelligence with the Culture Fair Test
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Test;
