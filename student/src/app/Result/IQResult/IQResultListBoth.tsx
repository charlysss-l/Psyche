import React from 'react';
import IQResultsList from '..//IQResult/IQResultList'; // Import your IQ Results component
import OmrIQResultsList from '..//IQResult/OmrIQResultList';
import styles from '..//IQResult/IQResultListBoth.module.scss';

const IQResultListBoth: React.FC = () => {
  return (
    <div className={styles.dashboardContainer}>
      <h1>Results Dashboard</h1>
      
      <section className={styles.resultSection}>
        <IQResultsList /> 
      </section>
      
      <section className={styles.resultSection}>
        <OmrIQResultsList /> 
      </section>
    </div>
  );
};

export default IQResultListBoth;
