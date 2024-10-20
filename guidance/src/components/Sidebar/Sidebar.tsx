import React from 'react'
import { Link } from 'react-router-dom'
import style from './page.module.scss'
const Sidebar = () => {
  return (
    <div className={style.sidebar}>
        <ul>
            <li>
                <Link to='/profile' className={style.link}>Profile</Link>
            </li>
        </ul>
    </div>
  )
}

export default Sidebar