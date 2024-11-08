import React from 'react';
import { Link } from 'react-router-dom';
import style from './guidancesidebar.module.scss';

const Sidebar: React.FC = () => {
  return (
    <div className={style.sidebar_gd}>
      <ul className={style.sidebar_UL_gd}>
        <li className={style.sidebar_LI_gd}>
          <Link to="/profile" className={style.link_gd}>
            <img src="https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg" alt="Profile Icon" className={style.icon} />
            Profile
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
