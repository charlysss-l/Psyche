import React from 'react';
import { Link } from 'react-router-dom';
import style from './psychologypftest.module.scss';

const Test = () => {
  return (
    <div className={style.TestContent}>
      <h1>List of Test</h1>
      <div className={style.ListTest}>
        <div className={style.TestPF}>
          <Link to="/pftest" className={style.pfLink}>
            Catell's 16 Personality Factor Questionnaire
          </Link>
        </div>
        <div className={style.iqLinkContainer}>
          <Link to="/iqtest" className={style.iqLink}>
            IQ Test
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Test;
