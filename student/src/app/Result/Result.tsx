import React from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import style from './page.module.scss'
const Result = () => {

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
    <div className={style.ResultContent}>
      <h1>List of Results</h1>
        <div className={style.ListResult}>
          <div className={style.TestPF_res}>
            <Link to="/pfbothlist" className={style.pfLink_res}>PF Results</Link>
          </div>
         
          <div className={style.iqLinkContainer_res}>
          <Link to="/iqresultlistboth" className={style.iqLink_res}>IQ Results</Link>
          </div>

          <div className={style.iqLinkContainer_res}>
          <Link to="/cfresultlistboth" className={style.iqLink_res}>CF Results</Link>
          </div>
          
        </div>
    </div>
  )
}

export default Result