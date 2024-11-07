import React from 'react';
import style from './guidancenavbar.module.scss';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className={style.navbar_gd}>
      <div className={style.logoSection}>
        <h1>Guidance</h1>
        <p>16PF & IQ Test</p>
      </div>
      
      <ul className={style.navbar_UL_gd}>
        <li className={style.navbar_LI_gd}>
          <Link to="/" className={style.navlink_gd}>Home</Link>
        </li>
        <li className={style.navbar_LI_gd}>
          <Link to="/calendar" className={style.navlink_gd}>Calendar</Link>
        </li>
        <li className={style.navbar_LI_gd}>
          <Link to="/consultation" className={style.navlink_gd}>Consultation</Link>
        </li>
        <li className={style.navbar_LI_gd}>
          <Link to="/login" className={style.navlink_gd}>Login</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
