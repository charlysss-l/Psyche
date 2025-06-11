import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import style from "./studentNavbar.module.scss";

import homeIcon from "../../images/home-page.png";
import testIcon from "../../images/questionnaire.png";
import omrIcon from "../../images/camera.png";
import resultIcon from "../../images/results.png";
import surveyIcon from "../../images/survey.png";
import consultationIcon from "../../images/conversation.png";
import logoImage from "../../images/logoPNG.png";
import settingIcon from "../../images/setting.png";


const Navbar = () => {
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleIconClick = () => {
    if (window.innerWidth <= 768) {
      setIsMobileSidebarOpen(false);
    } else {
      setIsSidebarExpanded(true);
    }
  };

  const handleCloseSidebar = () => {
    setIsSidebarExpanded(false);
    setIsMobileSidebarOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        handleCloseSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks = [
    { to: "/home", label: "Home", icon: homeIcon },
    { to: "/test", label: "Test", icon: testIcon },
    { to: "/omr", label: "OMR", icon: omrIcon },
    { to: "/result", label: "Result", icon: resultIcon },
    { to: "/consultation", label: "Consultation", icon: consultationIcon },
        { to: "/surveyIntro", label: "Survey", icon: surveyIcon },

        { to: "/profile", label: "Settings", icon: settingIcon },


  ];

  return (
    <>
      <button className={style.burgerButton} onClick={() => setIsMobileSidebarOpen(true)}>
        <span className={style.burgerLines}></span>
        <span className={style.burgerLines}></span>
        <span className={style.burgerLines}></span>
      </button>

      {isMobileSidebarOpen && (
        <div className={style.overlay} onClick={handleCloseSidebar}></div>
      )}

      <nav
        className={`${style.studentNavbar} ${
          isMobileSidebarOpen
            ? style.mobileOpen
            : isSidebarExpanded
            ? style.expanded
            : style.collapsed
        }`}
        ref={sidebarRef}
      >
        <div className={style.logoSection}>
          {isSidebarExpanded || isMobileSidebarOpen ? (
            <>
              <h1>DiscoverU</h1>
              <p>Student</p>
            </>
          ) : (
            <img src={logoImage} alt="DiscoverU Logo" className={style.logoImage} />
          )}
        </div>

        <div className={style.navigationSection}>
          <ul className={style.navList}>
            {navLinks.map((link) => (
              <li
                className={style.navItem}
                key={link.to}
                onClick={handleIconClick}
                data-label={link.label} 
              >
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    isActive ? `${style.navLink} ${style.active}` : style.navLink
                  }
                >
                  <img
                    src={link.icon}
                    alt={`${link.label} icon`}
                    className={style.navIcon}
                  />
                  {(isSidebarExpanded || isMobileSidebarOpen) && (
                    <span className={style.span}>{link.label}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {(isSidebarExpanded || isMobileSidebarOpen) && (
          <div className={style.navRight}>
            <button onClick={handleLogout} className={style.logoutButton}>
              Logout
            </button>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
