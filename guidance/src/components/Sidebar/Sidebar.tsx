import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className="sidebar">
        <ul>
            <li>
                <Link to='/profile'>Profile</Link>
            </li>
        </ul>
    </div>
  )
}

export default Sidebar