import React from 'react'
import PFOnlineList from '../PFOnlineList/PFOnlineList'
import PFOMRList from '../PFOMRList/PFOMRList'
const PFResultsDashboard = () => {
  return (
    <div>
        <h1>PFResultsDashboard</h1>
    
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