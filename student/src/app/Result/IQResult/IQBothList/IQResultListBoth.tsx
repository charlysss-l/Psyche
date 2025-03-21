import React from 'react';
import { useEffect } from 'react';
import IQResultsList from '..//IQOnlineList/IQResultList';
import OmrIQResultsList from '..//IQOMRList/OmrIQResultList';
import styles from './IQResultListBoth.module.scss';

const IQResultListBoth: React.FC = () => {

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
      <h1 className={styles.dashboardTitle}>Results Dashboard</h1>
      
      <section className={styles.resultSection}>
        <IQResultsList /> 
      </section>
      
      <section className={styles.resultSection}>
        <OmrIQResultsList /> 
      </section>
    </div>
  );
};

export default IQResultListBoth;
