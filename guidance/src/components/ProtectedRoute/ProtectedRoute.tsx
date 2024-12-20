import React from "react";
import { Navigate } from "react-router-dom";

// Protected Route component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Check if the user is logged in (by checking the token in localStorage)
  const token = localStorage.getItem("token");

  if (!token) {
    // If no token is found, redirect to the login page
    return <Navigate to="/" />;
  }

  // If token is present, render the protected page
  return <>{children}</>;
};

export default ProtectedRoute;
