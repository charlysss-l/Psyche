import React from 'react'
import PFOnlineList from '../PFOnlineList/PFOnlineList'
import PFOMRList from '../PFOMRList/PFOMRList'
import style from '../studentpfresult.module.scss'
const PFResultsDashboard = () => {
  return (
    <div className={style.pfresultDashboard}>
        <h1 >PFResultsDashboard</h1>
    
    <section>
        <PFOnlineList /> 
    </section>

    <section>
        <PFOMRList /> 
    </section>
    </div>
  );
};

export default PFResultsDashboard