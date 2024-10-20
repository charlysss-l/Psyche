import React from 'react'
import style from './page.module.scss'
import { Link } from 'react-router-dom'
const Sidebar = () => {
  return (
    <div className={style.sidebar}>
        <ul>
            <li>
                <Link to="/profile" className={style.link}>Profile</Link>
            </li>
            <li>
                <Link to="/omr" className={style.link}>OMR</Link>
            </li>
        </ul>
    </div>
  )
}

export default Sidebar