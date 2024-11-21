import React, { useState } from "react";
import { NavLink } from 'react-router-dom'; // Import NavLink
import style from './psychologysidebar.module.scss';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={style.sidebarContainer}>
      <button onClick={toggleSidebar} className={style.toggleButton}>
        {isOpen ? "Close" : "Menu"}
      </button>
      <div className={`${style.sidebar} ${isOpen ? style.open : ""}`}>
        <ul className={style.sidebar_UL}>
          <li className={style.sidebar_LI}>
            <NavLink 
              to="/profile" 
              className={({ isActive }) => `${style.link} ${isActive ? style.active : ''}`} // Conditionally apply 'active' class
            >
              <img 
                src="https://cdn-icons-png.flaticon.com/512/848/848043.png" 
                alt="Profile Icon" 
                className={style.icon} 
              />
              Profile
            </NavLink>
          </li>
          <li className={style.sidebar_LI}>
            <NavLink 
              to="/omr" 
              className={({ isActive }) => `${style.link} ${isActive ? style.active : ''}`} // Conditionally apply 'active' class
            >
              <img 
                src="https://cdn-icons-png.flaticon.com/512/9536/9536628.png" 
                alt="OMR Icon" 
                className={style.icon} 
              />
              OMR
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
