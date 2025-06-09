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

const Navbar = () => {
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Expand sidebar when clicking an icon or sidebar
  const handleIconClick = () => {
    setIsSidebarExpanded(true);
  };

  // Collapse sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarExpanded(false);
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
    { to: "/profile", label: "Profile", icon: contentIcon },
  ];

  return (
    <nav
      className={`${style.studentNavbar} ${
        isSidebarExpanded ? style.expanded : style.collapsed
      }`}
      ref={sidebarRef}
    >
      <div className={style.logoSection}>
        {isSidebarExpanded ? (
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
            <li className={style.navItem} key={link.to} onClick={handleIconClick}>
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
                {/* Show label only if expanded */}
                {isSidebarExpanded && <span>{link.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Show Logout button only when sidebar is expanded */}
      {isSidebarExpanded && (
        <div className={style.navRight}>
          <button onClick={handleLogout} className={style.logoutButton}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
