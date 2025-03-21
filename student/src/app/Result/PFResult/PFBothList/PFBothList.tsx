import React from 'react'
import { useEffect } from 'react'
import PFOMRList from '../PFOMRList/PFOMRList'
import PFOnlineList from '../PFOnlineList/PFOnlineList'
import styles from '..//PFBothList/PFBothList.module.scss'

const PFBothList = () => {

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
    <div className={styles.dashboardContainer}>
      <h1 className = {styles.dashboardTitle
      }>Results Dashboard</h1>
      
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