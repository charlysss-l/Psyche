import React from 'react'
import { Link } from 'react-router-dom'
import style from './page.module.scss';
const Navbar = () => {
  return (
    <nav className="navbar">
        <ul>
            <li>
                <Link to='/' className={style.navlink}>Home</Link>
            </li>
            <li>
                <Link to='/calendar'  className={style.navlink}>Calendar</Link>
            </li>
            <li>
                <Link to='/consultation'  className={style.navlink}>Consultation</Link>
            </li>
        </ul>
    </nav>
  )
}

export default Navbar