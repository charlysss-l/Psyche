import React from 'react'
import { Link } from 'react-router-dom'
import style from './page.module.scss';

const Navbar = () => {
  return (
    <nav className={style.navbar_st}>
        <ul className={style.navbar_UL_st}>
            <li className={style.navbar_LI_st}>
                <Link to="/" className={style.navlink_st}>Report</Link>
            </li>
            <li className={style.navbar_LI_st}>
                <Link to="/test" className={style.navlink_st}>Test</Link>
            </li>
            <li className={style.navbar_LI_st}>
                <Link to="/user" className={style.navlink_st}>User</Link>
            </li>
        </ul>
    </nav>
  )
}

export default Navbar