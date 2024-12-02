import React from "react";
import { NavLink } from "react-router-dom";
import style from "./studentNavbar.module.scss";

const Navbar = () => {
  return (
    <nav className={style.studentNavbar}>
      <div className={style.logoSection}>
        <h1>DiscoverU</h1>
        <p>Student</p>
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
              to="/test"
              className={({ isActive }) => isActive ? `${style.navLink} ${style.active}` : style.navLink}
            >
              Test
            </NavLink>
          </li>
          <li className={style.navItem}>
            <NavLink
              to="/result"
              className={({ isActive }) => isActive ? `${style.navLink} ${style.active}` : style.navLink}
            >
              Result
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
              to="/surveyDashboard"
              className={({ isActive }) => isActive ? `${style.navLink} ${style.active}` : style.navLink}
            >
              Survey
            </NavLink>
          </li>
          <li className={style.navItem}>
            <NavLink
              to="/"
              className={({ isActive }) => isActive ? `${style.navLink} ${style.active}` : style.navLink}
            >
              Logout
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
