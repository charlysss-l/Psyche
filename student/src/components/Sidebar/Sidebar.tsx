import React, { useState } from "react";
import { Link } from 'react-router-dom';
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
              <Link to="/profile" className={style.link}>
                <img src="https://cdn-icons-png.flaticon.com/512/848/848043.png" alt="Profile Icon" className={style.icon} />
                Profile
              </Link>
            </li>
            <li className={style.sidebar_LI}>
              <Link to="/omr" className={style.link}>
                <img src="https://cdn-icons-png.flaticon.com/512/9536/9536628.png" alt="OMR Icon" className={style.icon} />
                OMR
              </Link>
            </li>
          </ul>
        </div>

      </div>
  );
};

export default Sidebar;
