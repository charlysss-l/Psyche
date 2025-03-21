import React from 'react'
import { useEffect } from 'react'
import styles from './page.module.scss'
import {Link} from 'react-router-dom'
const AllOMR = () => {

     useEffect(() => {
          // Set viewport for zoom-out effect
          const metaViewport = document.querySelector('meta[name="viewport"]');
          if (metaViewport) {
            metaViewport.setAttribute("content", "width=device-width, initial-scale=0.8, maximum-scale=1.0");
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
      <h1 className={styles.OMRTITLEnext}>Select Your Test To Upload </h1>
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