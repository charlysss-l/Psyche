import React from 'react';
import { Link } from 'react-router-dom';
import style from './studentsidebar.module.scss';

const Sidebar: React.FC = () => {
  return (
    <div className={style.sidebar}>
      <ul className={style.sidebar_UL}>
        <li className={style.sidebar_LI}>
          <Link to="/profile" className={style.link}>
            <img src="https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg" alt="Profile Icon" className={style.icon} />
            Profile
          </Link>
        </li>
        <li className={style.sidebar_LI}>
          <Link to="/omr" className={style.link}>
            <img src="https://static-00.iconduck.com/assets.00/camera-icon-2048x1821-0b66mmq3.png" alt="OMR Icon" className={style.icon} />
            OMR
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
