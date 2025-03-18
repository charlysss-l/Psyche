import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import DarkMode from "../../darkMode/darkMode";
import style from "./psychologynavbar.module.scss";

import reportIcon from "../../images/report.png";
import testIcon from "../../images/questionnaire.png";
import omrIcon from "../../images/camera.png";
import surveyIcon from "../../images/survey.png";
import userIcon from "../../images/user.png";
import contentIcon from "../../images/notes.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const navLinks = [
    { to: "/report", label: "Report", icon: reportIcon },
    { to: "/test", label: "Test", icon: testIcon },
    { to: "/omr", label: "OMR", icon: omrIcon },
    { to: "/surveyDashboard", label: "Survey", icon: surveyIcon },
    { to: "/user", label: "User", icon: userIcon },
    { to: "/contentEditor", label: "Content", icon: contentIcon },
  ];

  return (
    <nav className={style.studentNavbar}>
      <div className={style.logoSection}>
        <h1>DiscoverU</h1>
        <p>Psychology</p>
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
                <NavLink to="/profile" className={style.dropdownLinkSettings}>
                  Settings
                </NavLink>
              </li>
              <li>
                <DarkMode />
              </li>
              <li>
                <button onClick={handleLogout} className={style.dropdownLinkLogout}>
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
