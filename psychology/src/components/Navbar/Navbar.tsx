import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import style from "./psychologynavbar.module.scss";


const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("studentId");

    // Redirect to the login page
    navigate("/");
  };
  return (
    <nav className={style.studentNavbar}>
      <div className={style.logoSection}>
        <h1>DiscoverU</h1>
        <p>Psychology</p>
      </div>

      <div className={style.navigationSection}>
        <ul className={style.navList}>
          <li className={style.navItem}>
            <NavLink
              to="/report"
              className={({ isActive }) => isActive ? `${style.navLink} ${style.active}` : style.navLink}
            >
              Report
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
              to="/surveyDashboard"
              className={({ isActive }) => isActive ? `${style.navLink} ${style.active}` : style.navLink}
            >
              Survey
            </NavLink>
          </li>
          <li className={style.navItem}>
            <NavLink
              to="/user"
              className={({ isActive }) => isActive ? `${style.navLink} ${style.active}` : style.navLink}
            >
              User
            </NavLink>
          </li>
          <li className={style.navItem}>
            <NavLink
              to="/contentEditor"
              className={({ isActive }) => isActive ? `${style.navLink} ${style.active}` : style.navLink}
            >
              Content Editor
            </NavLink>
          </li>
          <li className={style.navItem}>
            <NavLink
              to="/"
              onClick={handleLogout}
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
