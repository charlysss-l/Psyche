import React from 'react'
import PFOMRList from '../PFOMRList/PFOMRList'
import PFOnlineList from '../PFOnlineList/PFOnlineList'
import styles from '..//PFBothList/PFBothList.module.scss'

const PFBothList = () => {
  return (
    <div className={styles.dashboardContainer}>
      <h1>Results Dashboard</h1>
      
      <section className={styles.resultSection}>
        <PFOnlineList /> 
      </section>
      
      <section className={styles.resultSection}>
        <PFOMRList /> 
      </section>
    </div>
  );
};

export default PFBothList