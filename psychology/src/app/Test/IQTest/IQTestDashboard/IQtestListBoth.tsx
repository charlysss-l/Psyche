import React from 'react';
import IQResultsList from '../IQOnlineList/IQResultsList';
import OmrIQResultsList from '../IQOmrList/Omr_IQResultList';
import styles from './IQTestListBoth.module.scss';

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
