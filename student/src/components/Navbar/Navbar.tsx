import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import style from "./studentNavbar.module.scss";
import DarkMode from "../../darkMode/darkMode";

import homeIcon from "../../images/home-page.png";
import testIcon from "../../images/questionnaire.png";
import omrIcon from "../../images/camera.png";
import resultIcon from "../../images/results.png";
import surveyIcon from "../../images/survey.png";
import consultationIcon from "../../images/conversation.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
      if (window.innerWidth > 900) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
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
      </div>

      {isMobile ? (
        <button className={style.burgerMenu} onClick={toggleMenu}>
          &#9776;
        </button>
      ) : (
        <>
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
                    <NavLink to="/profile" className={style.settingsDesk}>
                      Settings
                    </NavLink>
                  </li>
                  <li>
                    <DarkMode />
                  </li>
                  <li>
                    <button onClick={handleLogout} className={style.logoutDesk}>
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </>
      )}

      {isMobile && isMenuOpen && (
        <div className={style.mobileMenu}>
          <ul className={style.navList}>
            {navLinks.map((link) => (
              <li className={style.navItem} key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    isActive ? `${style.navLink} ${style.active}` : style.navLink
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className={style.dropdownMenu}>
          <NavLink
  to="/profile"
  className={style.settingsMobile}
  onClick={() => setIsMenuOpen(false)} // CLOSE MENU ON CLICK
>
  Settings
</NavLink>

<div onClick={() => setIsMenuOpen(false)}>
  <DarkMode />
</div>

<button
  onClick={() => {
    setIsMenuOpen(false); // CLOSE MENU ON CLICK
    handleLogout();
  }}
  className={style.logoutMobile}
>
  Logout
</button>

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
