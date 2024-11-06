import React from 'react'
import style from './studentnavbar.module.scss'
import { Link } from 'react-router-dom'
const Navbar = () => {
  return (
   <nav className={style.navbar}>
    <ul>
        <li>
            <Link to="/" className={style.navlink}>Home</Link>
        </li>
        <li>
            <Link to="/test" className={style.navlink}>Test</Link>
        </li>
        <li>
            <Link to="/result" className={style.navlink}>Result</Link>
        </li>
        <li>
            <Link to="/consultation" className={style.navlink}>Consultation</Link>
        </li>

<li>
    <Link to="/Login" className={style.navlink}>Login</Link>
</li>
        
    </ul>

   </nav>
  )
}

export default Navbar