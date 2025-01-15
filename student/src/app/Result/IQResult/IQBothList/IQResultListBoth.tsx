import React from 'react';
import IQResultsList from '..//IQOnlineList/IQResultList';
import OmrIQResultsList from '..//IQOMRList/OmrIQResultList';
import styles from './IQResultListBoth.module.scss';

const IQResultListBoth: React.FC = () => {
  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.dashboardTitle}>Results Dashboard</h1>
      
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
