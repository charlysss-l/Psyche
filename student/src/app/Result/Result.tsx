import React from 'react';
import { Link } from 'react-router-dom';
import style from './page.module.scss';

const Result = () => {
  return (
    <div className={style.ResultContent}>
      <h1>List of Results</h1>
      <div className={style.ListTest}>
        <div className={style.TestPF}>
          <Link to="/pf-result" className={style.pfLink}>
            Catell's 16 Personality Factor Questionnaire Result
          </Link>
        </div>
        <div className={style.iqLinkContainer}>
          <Link to="/iqtest" className={style.iqLink}>
            IQ Test Result
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Result;
