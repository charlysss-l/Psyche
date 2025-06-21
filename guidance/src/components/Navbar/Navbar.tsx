import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import style from "./guidancenavbar.module.scss";

import homeIcon from "../../images/home-page.png";
import calendarIcon from "../../images/calendar.png";
import consultationIcon from "../../images/conversation.png";
import accountIcon from "../../images/user.png";
import logoImage from "../../images/newLogo.png";
import settingIcon from "../../images/setting.png";


const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [counselorTitle, setCounselorTitle] = useState("Counselor");
  const [isEditing, setIsEditing] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false); // Track animation state

  useEffect(() => {
    const savedTitle = localStorage.getItem("counselorTitle");
    if (savedTitle) {
      setCounselorTitle(savedTitle);
    }
  }, []);

  const handleTitleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setCounselorTitle(event.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditing(false);
    localStorage.setItem("counselorTitle", counselorTitle);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    localStorage.removeItem("fullName");
    navigate("/login");
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
    { to: "/calendar", label: "Calendar", icon: calendarIcon },
    { to: "/consultation", label: "Consultation", icon: consultationIcon },
    ...(role === "main" ? [{ to: "/create-account", label: "Account", icon: accountIcon }] : []),
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
              <h1>Discover<span className={style.yellow}>U</span></h1>
              {isEditing ? (
                  <input
                    type="text"
                    value={counselorTitle}
                    onChange={handleTitleChange}
                    onBlur={handleTitleBlur}
                    autoFocus
                    className={style.editableInput}
                  />
                ) : (
                  <p
                    onClick={() => setIsEditing(true)}
                    className={`${style.editableText} ${startAnimation ? style.animated : ""}`}
                    onMouseEnter={() => setStartAnimation(true)} // Start animation on hover
                  >
                    <span className={style.editableSpan}>{counselorTitle}</span>
                  </p>
                )}
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
