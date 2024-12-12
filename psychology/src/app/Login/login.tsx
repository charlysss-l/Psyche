import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./pagelogin.module.scss";
import backendUrl from "../../config"; // Adjust the path if `config.ts` is in a different location
//login for users and handling password reset.

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success message
  const [forgotPasswordModal, setForgotPasswordModal] = useState<boolean>(false);
  const [resetUsername, setResetUsername] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      const response = await loginUser(email, password);
      setError("");
      
      if (response.token) {
        // Store the token in localStorage or sessionStorage
        localStorage.setItem("token", response.token);
        setError("");
        // Show success message
        setSuccessMessage("Login successful!");

        // Redirect to the /report page after a delay (to allow the message to show)
        setTimeout(() => {
          navigate("/report"); // Redirect to /report route
        }, 1500); // 1.5 seconds delay
      } else {
        setError("Invalid username or password.");
      }
    } catch (error) {
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
    const response = await fetch(`${backendUrl}/api/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    return response.json();
  };

  const handleForgotPassword = async () => {
    if (resetUsername !== "cvsu.psychologydepartment@gmail.com") {
      setResetError("Invalid username.");
      return;
    }

    if (!newPassword) {
      setResetError("Please provide a new password.");
      return;
    }


    try {
      const response = await fetch(`${backendUrl}/api/auth/forgot-password`, {
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
        <h1 className={styles.loginForm_h1}>Welcome Back!</h1>
        <h2 className={styles.loginForm_h2}>Login</h2>
        
        {error && <p className={styles.errorMessage}>{error}</p>}
        {successMessage && <p className={styles.successMessage}>{successMessage}</p>} {/* Success message */}
        
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
          <input
            className={styles.logInput}
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
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
        <label>Enter Your Old Username:</label>
        <input
          type="text"
          value={resetUsername}
          onChange={(e) => setResetUsername(e.target.value)}
          placeholder="Enter your username"
        />
        <label>New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter your new password"
        />
        <button onClick={handleForgotPassword}>Submit</button>
        <button onClick={() => setForgotPasswordModal(false)}>Cancel</button>
          </div>
        </div>
      </>
    )}
    </div>
  );
}


export default Login;
