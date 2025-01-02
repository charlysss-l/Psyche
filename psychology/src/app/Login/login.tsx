import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./pagelogin.module.scss";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import backendUrl from "../../config"; // Adjust the path if `config.ts` is in a different location

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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
    }
  }, []);

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
        localStorage.setItem("token", response.token);
        setSuccessMessage("Login successful!");
        setTimeout(() => {
          navigate("/report");
        }, 1000);
      } else {
        setError("Invalid username or password.");
      }
    } catch (error) {
      const err = error as any;
      if (err.message === "Network Error" || err.message.includes("Failed to fetch")) {
        setError("Login failed: Please check your internet connection.");
        alert("No internet connection or the server is unreachable. Please try again later.");
      } else if (err?.message === "Invalid username") {
        setError("Invalid username.");
      } else if (err?.message === "Invalid password") {
        setError("Invalid password.");
      } else {
        setError("Login failed: Invalid Credentials");
      }
    }
  };

  const loginUser = async (email: string, password: string) => {
    try {
      const response = await fetch(`${backendUrl}/api/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error("Network Error");
      }
      throw error;
    }
  };

  const handleForgotPassword = async () => {
    if (resetUsername !== "cvsu.psychology@gmail.com") {
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
                type="text"
                value={resetUsername}
                onChange={(e) => setResetUsername(e.target.value)}
                placeholder="Enter your username"
                required
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
              <button onClick={() => setForgotPasswordModal(false)} className={styles.cancelButton
              }>Cancel</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
