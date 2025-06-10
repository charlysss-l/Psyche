import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import style from "./psychologynavbar.module.scss";

import reportIcon from "../../images/report.png";
import testIcon from "../../images/questionnaire.png";
import omrIcon from "../../images/camera.png";
import surveyIcon from "../../images/survey.png";
import userIcon from "../../images/user.png";
import contentIcon from "../../images/notes.png";
import logoImage from "../../images/LOGOnewDark.png";
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
    { to: "/report", label: "Report", icon: reportIcon },
    { to: "/test", label: "Test", icon: testIcon },
    { to: "/omr", label: "OMR", icon: omrIcon },
    { to: "/surveyDashboard", label: "Survey", icon: surveyIcon },
    { to: "/user", label: "User", icon: userIcon },
    { to: "/contentEditor", label: "Content", icon: contentIcon },
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
              <p>Psychology</p>
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
