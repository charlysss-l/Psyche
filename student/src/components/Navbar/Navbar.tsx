import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import style from "./studentNavbar.module.scss";
import DarkMode from "../../darkMode/darkMode";

import homeIcon from "../../images/home-page.png";
import testIcon from "../../images/questionnaire.png";
import omrIcon from "../../images/camera.png";
import resultIcon from "../../images/results.png";
import surveyIcon from "../../images/notes.png";
import consultationIcon from "../../images/conversation.png";

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
    { to: "/home", label: "Home", icon: homeIcon },
    { to: "/test", label: "Test", icon: testIcon },
    { to: "/omr", label: "OMR", icon: omrIcon },
    { to: "/result", label: "Result", icon: resultIcon },
    { to: "/surveyDashboard", label: "Survey", icon: surveyIcon },
    { to: "/consultation", label: "Consultation", icon: consultationIcon },
  ];

  return (
    <nav className={style.studentNavbar}>
      <div className={style.logoSection}>
        <h1>DiscoverU</h1>
        <p>Student</p>
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
