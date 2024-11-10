import React from 'react';
import { Link } from 'react-router-dom';
import style from './guidancesidebar.module.scss';

const Sidebar: React.FC = () => {
  return (
    <div className={style.sidebar_gd}>
      <ul className={style.sidebar_UL_gd}>
        <li className={style.sidebar_LI_gd}>
          <Link to="/profile" className={style.link_gd}>
            <img src="https://cdn-icons-png.flaticon.com/512/9536/9536628.png" alt="Profile Icon" className={style.icon} />
            Profile
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
