import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import style from "./guidancenavbar.module.scss";
import DarkMode from "../../darkMode/darkMode";

import homeIcon from "../../images/home-page.png";
import calendarIcon from "../../images/calendar.png";
import consultationIcon from "../../images/conversation.png";
import accountIcon from "../../images/user.png";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // Get the role from localStorage
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const navLinks = [
    { to: "/home", label: "Home", icon: homeIcon },
    { to: "/calendar", label: "Calendar", icon: calendarIcon },
    { to: "/consultation", label: "OMR", icon: consultationIcon },
    ...(role === "main" ? [{ to: "/create-account", label: "Account", icon: accountIcon }] : []),
  ];

  return (
    <nav className={style.studentNavbar}>
      <div className={style.logoSection}>
        <h1>DiscoverU</h1>
        <p>Guidance</p>
      </div>

      <div className={style.navigationSection}>
        <ul className={style.navList}>
          {navLinks.map((link) => (
            <li className={style.navItem} key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  isActive ? `${style.navLink} ${style.active}` : style.navLink
                }
              >
                <img src={link.icon} alt={`${link.label} icon`} className={style.navIcon} />
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className={style.navRight}>
        <div className={style.dropdown}>
          <button className={style.dropdownToggle} onClick={toggleDropdown}>
            <img
              src="https://w7.pngwing.com/pngs/340/956/png-transparent-profile-user-icon-computer-icons-user-profile-head-ico-miscellaneous-black-desktop-wallpaper-thumbnail.png"
              alt="Account"
              className={style.accountImage}
            />
            <span className={style.arrowIcon}>&#9662;</span>
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
