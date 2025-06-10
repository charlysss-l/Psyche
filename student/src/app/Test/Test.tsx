import React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import style from './studentpftest.module.scss';
import { Brain, Eye, Layers } from 'lucide-react';

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

      const tests = [
        {
          title: "Catell's 16 Personality Factor",
          description: "A self-report questionnaire to measure personality traits.",
          icon: <Brain size={48} color="#6a4baf" />,
          link: "/intro-pf"
        },
        {
          title: "Raven’s Standard Progressive Matrices",
          description: "A non-verbal assessment of abstract reasoning and intelligence.",
          icon: <Eye size={48} color="#6a4baf" />,
          link: "/intro-iq"
        },
        {
          title: "Culture Fair Intelligence Test",
          description: "Measures fluid intelligence independently of cultural background.",
          icon: <Layers size={48} color="#6a4baf" />,
          link: "/intro-cf"
        }
      ];

      return (
        <div className={style.TestContent}>
          <h1>List of Tests</h1>
          <div className={style.ListTest}>
            {tests.map((test, index) => (
              <div className={style.TestCard} key={index}>
                <div className={style.testIcon}>{test.icon}</div>
                <h2>{test.title}</h2>
                <p>{test.description}</p>
                <Link to={test.link} className={style.testButton}>View Test</Link>
              </div>
            ))}
          </div>
        </div>
      );
    };
export default Test;
