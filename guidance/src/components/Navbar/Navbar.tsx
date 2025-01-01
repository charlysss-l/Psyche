import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import style from "./guidancenavbar.module.scss";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // Get the role from localStorage

  const handleLogout = () => {
    // Remove the token and user info from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    localStorage.removeItem("fullName");

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
          {role === "main" && ( // Conditionally render the Accounts link if the role is "main"
            <li className={style.navItem}>
              <NavLink
                to="/create-account"
                className={({ isActive }) => isActive ? `${style.navLink} ${style.active}` : style.navLink}
              >
                Account
              </NavLink>
            </li>
          )}
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
