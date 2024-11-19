import React from 'react'
import { Link } from 'react-router-dom'
import style from './page.module.scss'
const Result = () => {
  return (
    <div className={style.ResultContent}>
      <h1>List of Results</h1>
        <div className={style.ListResult}>
          <div className={style.TestPF_res}>
            <Link to="/pf-results" className={style.pfLink_res}>PF Results</Link>
          </div>
         
          <div className={style.iqLinkContainer_res}>
          <Link to="/iqresultlistboth" className={style.iqLink_res}>IQ Results</Link>
          </div>


          
        </div>
    </div>
  )
}

export default Result