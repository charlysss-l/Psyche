import React from 'react';
import { Link } from 'react-router-dom';
import style from './psychologynavbar.module.scss';

const Navbar = () => {
  return (
    <nav className={style.navbar}>
      <div className={style.logo}>
        <h1>Discover U</h1>
        <p>Psychology</p>
      </div>
      
      <div className={style.navbar_ps}>
        <ul className={style.navbar_UL_ps}>
          <li className={style.navbar_LI_ps}>
            <Link to="/" className={style.navlink_ps}>Report</Link>
          </li>
          <li className={style.navbar_LI_ps}>
            <Link to="/test" className={style.navlink_ps}>Test</Link>
          </li>
          <li className={style.navbar_LI_ps}>
            <Link to="/user" className={style.navlink_ps}>User</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
