import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // Array of allowed roles (e.g., ['main'])
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  // Check if the user is logged in (by checking the token in localStorage)
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // Retrieve the user's role from localStorage or context

  if (!token) {
    // If no token is found, redirect to the login page
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(role || "")) {
    // If the user's role is not allowed, redirect to a "Not Authorized" or home page
    return <Navigate to="/home" />;
  }

  // If token and role are valid, render the protected page
  return <>{children}</>;
};

export default ProtectedRoute;
