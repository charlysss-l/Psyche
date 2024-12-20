import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import style from "./guidancenavbar.module.scss";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("studentId");
    localStorage.removeItem("userId");

    // Redirect to the login page
    navigate("/login");
  };
  return (
    <nav className={style.studentNavbar}>
      <div className={style.logoSection}>
        <h1>DiscoverU</h1>
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
