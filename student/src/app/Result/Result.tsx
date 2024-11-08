import React from 'react'
import { Link } from 'react-router-dom'
const Result = () => {
  return (
    <div>
      <h1>List of Results</h1>
        <div>
          <Link to="/pf-results">PF Results</Link>
          <br />
          <Link to="/iq-results">IQ Results</Link>
        </div>
    </div>
  )
}

export default Result