import React from 'react'
import styles from './page.module.scss'
import {Link} from 'react-router-dom'
const OMR = () => {
  return (
    <div className={styles.OMRDiv}>
      <h1 className={styles.OMRTITLE}>Welcome to Discover U's OMR. </h1>
      <h6 className={styles.OMRDesc}>A machine learning technique called Optical Mark Recognition (OMR) gathers information from 
        paper markings for assessment and scoring. </h6>

        <div className={styles.OMRbutton}>
              <Link to="/test" className={styles.OMRlinkOnline}>Take Online Test</Link>
              <Link to="/omrcamera" className={styles.OMRLinkUpload}>Upload Test</Link>
        </div>

    </div>
  )
}

export default OMR