import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className="sidebar">
        <ul>
            <li>
                <Link to="/profile">Profile</Link>
            </li>
            <li>
                <Link to="/omr">OMR</Link>
            </li>
        </ul>
    </div>
  )
}

export default Sidebar