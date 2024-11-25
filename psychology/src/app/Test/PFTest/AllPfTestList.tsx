import React from 'react'
import PFOmrList from './PFOmrList/PFOmrList'
import PFResultsList from './PFResultsList/PFResultsList';
import styles from './AllPfTestList.module.scss'
const AllPfTestList = () => {
  return (
    <div className={styles.dashboardContainer}>
      <h1>Results Dashboard</h1>
      
      <section className={styles.resultSection}>
        <PFResultsList /> 
      </section>
      
      <section className={styles.resultSection}>
        <PFOmrList /> 
      </section>
    </div>
  );
};

export default AllPfTestList