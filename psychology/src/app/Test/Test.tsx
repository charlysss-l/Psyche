import React from 'react';
import { Link } from 'react-router-dom';
import style from './psychologypftest.module.scss';
import { Brain, Eye, Layers } from 'lucide-react';

const Test = () => {
  const tests = [
    {
      title: "Catell's 16 Personality Factor",
      description: "A self-report questionnaire to measure personality traits.",
      icon: <Brain size={48} color="#6a4baf" />,
      link: "/pftest"
    },
    {
      title: "Raven’s Standard Progressive Matrices",
      description: "A non-verbal assessment of abstract reasoning and intelligence.",
      icon: <Eye size={48} color="#6a4baf" />,
      link: "/iqtest"
    },
    {
      title: "Culture Fair Intelligence Test",
      description: "Measures fluid intelligence independently of cultural background.",
      icon: <Layers size={48} color="#6a4baf" />,
      link: "/cftest"
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
