import React from 'react';
import { Link } from 'react-router-dom';
import style from './page.module.scss';

const Navbar = () => {
  return (
    <nav className={style.studentNavbar}>
      <div className={style.logoSection}>
        <h1>Student</h1>
        <p>16PF & IQ Test</p>
      </div>
      
      <div className={style.navigationSection}>
        <ul className={style.navList}>
          <li className={style.navItem}>
            <Link to="/" className={style.navLink}>Home</Link>
          </li>
          <li className={style.navItem}>
            <Link to="/test" className={style.navLink}>Test</Link>
          </li>
          <li className={style.navItem}>
            <Link to="/user" className={style.navLink}>Result</Link>
          </li>
          <li className={style.navItem}>
            <Link to="/user" className={style.navLink}>Consultation</Link>
          </li>
          <li className={style.navItem}>
            <Link to="/login" className={style.navLink}>Login</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
