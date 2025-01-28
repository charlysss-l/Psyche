import React, { useState, useEffect } from "react";
import styles from "./darkMode.module.scss";

const DarkMode: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
      document.body.classList.toggle("dark-mode", savedTheme === "dark");
    }
  }, []);

  const setTheme = (theme: "light" | "dark") => {
    const isDark = theme === "dark";
    setIsDarkMode(isDark);
    localStorage.setItem("theme", theme);
    document.body.classList.toggle("dark-mode", isDark);
  };

  return (
    <div className={styles.themeToggleContainer}>
      <button
        onClick={() => setTheme("light")}
        className={`${styles.themeButton} ${styles.light} ${
          !isDarkMode ? styles.active : ""
        }`}
      >
        Light
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`${styles.themeButton} ${styles.dark} ${
          isDarkMode ? styles.active : ""
        }`}
      >
        Dark
      </button>
    </div>
  );
};

export default DarkMode;
