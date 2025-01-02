import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import backendURL from "../../config";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./pagelogin.module.scss";
//Provides login functionality with error/success feedback and a "Forgot Password" feature.
// Functional component for the Login page
const Login: React.FC = () => {
    // State variables for user input, error/success messages, and modal visibility

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success message
  const [forgotPasswordModal, setForgotPasswordModal] = useState<boolean>(false);
  const [resetUsername, setResetUsername] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      localStorage.removeItem("userId");
      localStorage.removeItem("fullName");
    }
  }, []);

  // Function to handle login form submission
  const handleSubmit = async (e: React.FormEvent) => {  
    e.preventDefault();
    // Validation to check if both email and password are filled
    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      setError(""); // Clear any previous error
      const response = await loginUser(email, password);
      
      if (response.token) {
        // Store the token in localStorage or sessionStorage
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", response.role); // Save the role
        localStorage.setItem("email", response.email);
        localStorage.setItem("userId", response.userId);
        localStorage.setItem("fullName", response.fullName);

        console.log("Stored email in localStorage:", response.email);  // Log email
        console.log("Stored userId in localStorage:", response.userId);  // Log userId

        setError(""); 
        // Show success message
        setSuccessMessage("Login successful!");

        // Redirect to the /report page after a delay (to allow the message to show)
        setTimeout(() => {
          navigate("/home"); // Redirect to /report route
        }, 1500); // 1.5 seconds delay
      } else {
        setError("Invalid username or password.");
      }
    } catch (error) {
            // Handle errors and set appropriate error messages

      const err = error as any; // type assertion
      if (err?.message === "Invalid username") {
        setError("Invalid username.");
      } else if (err?.message === "Invalid password") {
        setError("Invalid password.");
      } else {
        setError("Invalid Credentials!");
      }
      console.error(err);
    }
  };

  // Function to call the backend API
  const loginUser = async (email: string, password: string) => {
    // Sends a POST request to the API with email and password as JSON payload
    const response = await fetch(`${backendURL}/api/authGuidance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  
    if (!response.ok) {
      throw new Error("Login failed");
    }
  
    const data = await response.json();  // Capture the response data
    console.log("Backend response:", data);  // Log the response
  
    return data;
  };
  

  const handleForgotPassword = async () => {
        // Validate if the username is correct and if the new password is provided
    if (resetUsername !== "cvsu.guidance@gmail.com") {
      setResetError("Invalid username.");
      return;
    }

    if (!newPassword) {
      setResetError("Please provide a new password.");
      return;
    }

    try {
      const response = await fetch(`${backendURL}/api/authGuidance/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: resetUsername, newPassword }),
      });

      if (!response.ok) throw new Error("Failed to reset password");

      setResetError(null);
      setResetSuccessMessage("Password reset successful!");
      setTimeout(() => setForgotPasswordModal(false), 1500);
    } catch (error) {
      setResetError("Error resetting password. Try again.");
      console.error(error);
    }
  };



  return (
    <div className={styles.loginContainer}>
      <div className={styles.imageContainer}></div>
      <div className={styles.loginForm}>
      <div className ={styles.logoimg}></div>
        <h1 className={styles.loginForm_h1}>Welcome Back!</h1>
        <h3 className={styles.loginForm_h3}>Login to continue access</h3>
        {error && <p className={styles.errorMessage}>{error}</p>}
        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className={styles.logLabel}>Email:</label>
          <input
            className={styles.logInput}
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password" className={styles.logLabel}>Password:</label>
          <div className={styles.passwordInputContainer}>
          <input
          className={styles.logInput}
          type={showPassword ? "text" : "password"}
          id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
              type="button"
              className={styles.togglePasswordButton}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button type="submit" className={styles.submitButtonLog}>Login</button>
        </form>
        <button
          type="button"
          onClick={() => setForgotPasswordModal(true)}
          className={styles.forgotPasswordButton}
        >
          Forgot Password?
        </button>
      </div>
      {forgotPasswordModal && (
  <>
    <div
      className={styles.modalOverlay}
      onClick={() => setForgotPasswordModal(false)}
    ></div>
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h3>Forgot Password</h3>
        {resetError && <p className={styles.errorMessage}>{resetError}</p>}
        {resetSuccessMessage && (
          <p className={styles.successMessage}>{resetSuccessMessage}</p>
        )}
        <label>Enter your Email:</label>
        <input
          type="input"
          value={resetUsername}
          onChange={(e) => setResetUsername(e.target.value)}
          placeholder="Enter your username"
        />
        <label>New Password:</label>
        <div className={styles.passwordInputContainer}>
        <input
          type={showPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter your new password"
          className={styles.logInput}

        />
         <button
              type="button"
              className={styles.toggleConfirmPasswordButton}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        <button onClick={handleForgotPassword} className={styles.submitforgotpass}>Submit</button>
        <button onClick={() => setForgotPasswordModal(false)} className={styles.cancelButton}>Cancel</button>
          </div>
        </div>
      </>
    )}
    </div>  
  );
}

export default Login;
