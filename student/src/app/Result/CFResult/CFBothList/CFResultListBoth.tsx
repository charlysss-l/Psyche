import React from 'react';
import CFResultsList from '..//CFOnlineList/CFResultList';
import OmrCFResultsList from '..//CFOMRList/OmrCFResultList';
import styles from './CFResultListBoth.module.scss';

const CFResultListBoth: React.FC = () => {
  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.dashboardTitle}>Results Dashboard</h1>
      
      <section className={styles.resultSection}>
        <CFResultsList /> 
      </section>
      
      <section className={styles.resultSection}>
        <OmrCFResultsList /> 
      </section>
    </div>
  );
};

export default CFResultListBoth;
