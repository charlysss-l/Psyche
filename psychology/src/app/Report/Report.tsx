import React from 'react'
import PFStatistics from '../Test/PFTest/PFStatistics/PFStatistics'
import IQStatistics
 from '../Test/IQTest/IQStatistics/IQStatistics'
 import styles from './report.module.scss'
const Report = () => {
  return (
    <div>
      <h1 className={styles.repTitle}>Report</h1>
      <section className={styles.resultSection}>
        <PFStatistics /> 
      </section>
      <section className={styles.resultSectionIQ}>
        <IQStatistics /> 
      </section>
    </div>
  )
}

export default Report