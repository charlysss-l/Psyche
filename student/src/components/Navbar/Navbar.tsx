import React from 'react'
import style from './page.module.scss'
import { Link } from 'react-router-dom'
const Navbar = () => {
  return (
   <nav className={style.navbar_ps}>
    <ul className={style.navbar_UL}>
        <li className={style.navbar_LI}>
            <Link to="/" className={style.navlink}>Home</Link>
        </li>
        <li className={style.navbar_LI}>
            <Link to="/test" className={style.navlink}>Test</Link>
        </li>
        <li className={style.navbar_LI}>
            <Link to="/result" className={style.navlink}>Result</Link>
        </li >
        <li className={style.navbar_LI}>
            <Link to="/consultation" className={style.navlink}>Consultation</Link>
        </li>

        <li className={style.navbar_LI}>
            <Link to="/Login" className={style.navlink}>Login</Link>
        </li>
        
    </ul>

   </nav>
  )
}

export default Navbar