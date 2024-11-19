import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import style from './psychologynavbar.module.scss';

const Navbar = () => {
  const navigate = useNavigate(); // Initialize the navigate function for redirection

  // Handle logout
  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Redirect to the login page
    navigate("/");
  };

  return (
    <nav className={style.navbar}>
      <div className={style.logo}>
        <h1>Discover U</h1>
        <p>Psychology</p>
      </div>
      
      <div className={style.navbar_ps}>
        <ul className={style.navbar_UL_ps}>
          <li className={style.navbar_LI_ps}>
            <Link to="/report" className={style.navlink_ps}>Report</Link>
          </li>
          <li className={style.navbar_LI_ps}>
            <Link to="/test" className={style.navlink_ps}>Test</Link>
          </li>
          <li className={style.navbar_LI_ps}>
            <Link to="/surveyDashboard" className={style.navlink_ps}>Survey</Link>
          </li>
          <li className={style.navbar_LI_ps}>
            <Link to="/user" className={style.navlink_ps}>User</Link>
          </li>
          <li className={style.navbar_LI_ps}>
            <button onClick={handleLogout} className={style.navlink_logout}>Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
