import React from "react";
import { Link } from "react-router-dom";
import style from "./studentNavbar.module.scss";

const Navbar = () => {
  return (
    <nav className={style.studentNavbar}>
      <div className={style.logoSection}>
        <h1>Discover U</h1>
        <p>Student</p>
      </div>

      <div className={style.navigationSection}>
        <ul className={style.navList}>
          <li className={style.navItem}>
            <Link to="/home" className={style.navLink}>
              Home
            </Link>
          </li>
          <li className={style.navItem}>
            <Link to="/test" className={style.navLink}>
              Test
            </Link>
          </li>
          <li className={style.navItem}>
            <Link to="/result" className={style.navLink}>
              Result
            </Link>
          </li>
          <li className={style.navItem}>
            <Link to="/consultation" className={style.navLink}>
              Consultation
            </Link>
          </li>
          <li className={style.navItem}>
            <Link to="/" className={style.navLink}>
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
