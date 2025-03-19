import React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import style from './studentpftest.module.scss';

const Test = () => {
  
  useEffect(() => {
      // Set viewport for zoom-out effect
      const metaViewport = document.querySelector('meta[name="viewport"]');
      if (metaViewport) {
        metaViewport.setAttribute("content", "width=device-width, initial-scale=0.8, maximum-scale=1.0, user-scalable=no");
      } else {
        const newMeta = document.createElement("meta");
        newMeta.name = "viewport";
        newMeta.content = "width=device-width, initial-scale=0.8, maximum-scale=1.0, user-scalable=no";
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
