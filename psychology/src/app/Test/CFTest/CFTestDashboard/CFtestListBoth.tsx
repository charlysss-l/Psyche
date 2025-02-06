import React from 'react';
import CFResultsList from '../CFOnlineList/CFResultsList';
import OmrCFResultsList from '../CFOmrList/Omr_CFResultList';
import styles from './CFTestListBoth.module.scss';

const CFResultListBoth: React.FC = () => {
  return (
    <div className={styles.dashboardContainer}>
      <h1>Results Dashboard</h1>
      
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
