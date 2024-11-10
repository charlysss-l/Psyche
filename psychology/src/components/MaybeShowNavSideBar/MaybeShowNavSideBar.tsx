import { useEffect, useState, ReactNode } from "react";
import React from "react";
import { useLocation } from "react-router-dom";

// Explicitly typing children as ReactNode
interface MaybeShowNavSideBarProps {
  children: ReactNode;
}

const MaybeShowNavSideBar: React.FC<MaybeShowNavSideBarProps> = ({ children }) => {
  const location = useLocation();

  const [showNavbar, setShowNavBar] = useState(false);
  
  useEffect(() => {
    console.log('this is location:', location);
    if (location.pathname === "/") {
      setShowNavBar(false);
    } else {
      setShowNavBar(true);
    }
  }, [location]);

  return <div>{showNavbar && children}</div>;
};

export default MaybeShowNavSideBar;
