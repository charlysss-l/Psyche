import React from 'react'
import styles from './page.module.scss'
import {Link} from 'react-router-dom'
const AllOMR = () => {
  return (
    <div className={styles.OMRDiv}>
      <h1 className={styles.OMRTITLE}>Select Your Test To Upload </h1>
      <h3></h3>
      

        <div className={styles.OMRbutton}>
              <Link to="/pfomr" className={styles.OMRlinkOnline}>Personality Test</Link>
              <Link to="/iqomr" className={styles.OMRLinkUpload}>IQ Test</Link>
              <Link to="/cfomr" className={styles.OMRLinkUpload}>CF Test</Link>

        </div>

    </div>
  )
}

export default AllOMR