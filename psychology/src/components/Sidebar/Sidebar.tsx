import React from 'react'
import style from './page.module.scss'
import { Link } from 'react-router-dom'
const Sidebar = () => {
  return (
    <div className={style.sidebar_st}>
        <ul className={style.sidebar_UL_st}>
            <li className={style.sidebar_LI_st}>
                <Link to="/profile" className={style.link}>Profile</Link>
            </li>
            <li className={style.sidebar_LI_st}>
                <Link to="/omr" className={style.link}>OMR</Link>
            </li>
        </ul>
    </div>
  )
}

export default Sidebar