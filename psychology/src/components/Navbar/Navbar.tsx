import React from 'react'
import { Link } from 'react-router-dom'
import style from './page.module.scss';

const Navbar = () => {
  return (
    <nav className={style.navbar}>
        <ul>
            <li>
                <Link to="/" className={style.navlink}>Report</Link>
            </li>
            <li>
                <Link to="/test" className={style.navlink}>Test</Link>
            </li>
            <li>
                <Link to="/user" className={style.navlink}>User</Link>
            </li>
        </ul>
    </nav>
  )
}

export default Navbar