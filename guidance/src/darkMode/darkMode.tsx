// src/components/ThemeToggle.tsx
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

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? "dark" : "light";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);
    document.body.classList.toggle("dark-mode", newTheme === "dark");
  };

  return (
    <button onClick={toggleTheme} className={styles.darkModeButton}>
      {isDarkMode ? "🌙" : "☀️"}
    </button>
  );
};

export default DarkMode;
