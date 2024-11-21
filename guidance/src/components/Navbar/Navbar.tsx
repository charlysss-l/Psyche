import React from "react";
import { NavLink } from "react-router-dom";
import style from "./guidancenavbar.module.scss";

const Navbar = () => {
  return (
    <nav className={style.studentNavbar}>
      <div className={style.logoSection}>
        <h1>Discover U</h1>
        <p>Guidance</p>
      </div>

      <div className={style.navigationSection}>
        <ul className={style.navList}>
          <li className={style.navItem}>
            <NavLink
              to="/home"
              className={({ isActive }) => isActive ? `${style.navLink} ${style.active}` : style.navLink}
            >
              Home
            </NavLink>
          </li>
          <li className={style.navItem}>
            <NavLink
              to="/calendar"
              className={({ isActive }) => isActive ? `${style.navLink} ${style.active}` : style.navLink}
            >
              Calendar
            </NavLink>
          </li>
          <li className={style.navItem}>
            <NavLink
              to="/consultation"
              className={({ isActive }) => isActive ? `${style.navLink} ${style.active}` : style.navLink}
            >
              Consultation
            </NavLink>
          </li>
          <li className={style.navItem}>
            <NavLink
              to="/"
              className={({ isActive }) => isActive ? `${style.navLink} ${style.active}` : style.navLink}
            >
              Login
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
