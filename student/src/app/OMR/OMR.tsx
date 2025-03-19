import React from 'react'
import { useEffect } from 'react'
import styles from './page.module.scss'
import {Link} from 'react-router-dom'
const OMR = () => {

    useEffect(() => {
        // Set viewport for zoom-out effect
        const metaViewport = document.querySelector('meta[name="viewport"]');
        if (metaViewport) {
          metaViewport.setAttribute("content", "width=device-width, initial-scale=0.8, maximum-scale=1.0, user-scalable=no");
        } else {
          const newMeta = document.createElement("meta");
          newMeta.name = "viewport";
          newMeta.content = "width=device-width, initial-scale=0.8, maximum-scale=1.0, user-scalable=no";
          document.head.appendChild(newMeta);
        }
    
        // Cleanup function to reset viewport when leaving the page
        return () => {
          if (metaViewport) {
            metaViewport.setAttribute("content", "width=device-width, initial-scale=1.0");
          }
        };
      }, []);

  return (
    <div className={styles.OMRDiv}>
      <h1 className={styles.OMRTITLE}>Welcome to Discover U's OMR. </h1>
      <h6 className={styles.OMRDesc}>A machine learning technique called Optical Mark Recognition (OMR) gathers information from 
        paper markings for assessment and scoring. </h6>

        <div className={styles.OMRbutton}>
              <Link to="/test" className={styles.OMRlinkOnline}>Take Online Test</Link>
              <Link to="/allomr" className={styles.OMRLinkUpload}>Upload Test</Link>
        </div>

    </div>
  )
}

export default OMR