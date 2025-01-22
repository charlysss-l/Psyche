import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import DarkMode from "../../darkMode/darkMode";
import style from "./psychologynavbar.module.scss";

const Navbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Redirect to the login page
    navigate("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  return (
    <nav className={style.studentNavbar}>
      {/* Logo Section */}
      <div className={style.logoSection}>
        <h1>DiscoverU</h1>
        <p>Psychology</p>
      </div>

      {/* Navigation Links */}
      <div className={style.navigationSection}>
        <ul className={style.navList}>
          <li className={style.navItem}>
            <NavLink
              to="/report"
              className={({ isActive }) =>
                isActive ? `${style.navLink} ${style.active}` : style.navLink
              }
            >
              Report
            </NavLink>
          </li>
          <li className={style.navItem}>
            <NavLink
              to="/test"
              className={({ isActive }) =>
                isActive ? `${style.navLink} ${style.active}` : style.navLink
              }
            >
              Test
            </NavLink>
          </li>
          <li className={style.navItem}>
            <NavLink
              to="/omr"
              className={({ isActive }) =>
                isActive ? `${style.navLink} ${style.active}` : style.navLink
              }
            >
              OMR
            </NavLink>
          </li>
          <li className={style.navItem}>
            <NavLink
              to="/surveyDashboard"
              className={({ isActive }) =>
                isActive ? `${style.navLink} ${style.active}` : style.navLink
              }
            >
              Survey
            </NavLink>
          </li>
          <li className={style.navItem}>
            <NavLink
              to="/user"
              className={({ isActive }) =>
                isActive ? `${style.navLink} ${style.active}` : style.navLink
              }
            >
              User
            </NavLink>
          </li>
          <li className={style.navItem}>
            <NavLink
              to="/contentEditor"
              className={({ isActive }) =>
                isActive ? `${style.navLink} ${style.active}` : style.navLink
              }
            >
              Content
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Account Section */}
      <div className={style.navRight}>
        <div className={style.dropdown}>
          <button className={style.dropdownToggle} onClick={toggleDropdown}>
            <img
              src="https://w7.pngwing.com/pngs/340/956/png-transparent-profile-user-icon-computer-icons-user-profile-head-ico-miscellaneous-black-desktop-wallpaper-thumbnail.png"
              alt="Account"
              className={style.accountImage}
            />
            <span className={style.arrowIcon}>&#9662;</span> {/* Unicode for arrow */}
          </button>
          {isDropdownOpen && (
            <ul className={style.dropdownMenu}>
              <li>
                <NavLink to="/profile" className={style.dropdownLink}>
                  Settings
                </NavLink>
              </li>
              <li>
                <DarkMode />
              </li>
              <li>
                <button onClick={handleLogout} className={style.dropdownLink}>
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
