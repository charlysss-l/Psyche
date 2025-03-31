import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Studentlogin.module.scss";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import backendUrl from "../../config";

//  Handles user input (email, password), error, and success messages.
//  Sends user credentials to the server, processes the response, and stores important data in localStorage.


const Login: React.FC = () => {
     // State variables for email, password, error messages, and success messages
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();  // Used to navigate to different routes
  const location = useLocation();  // Provides access to the current location object
  const [loading, setLoading] = useState<boolean>(false); // Loading state


  // Show success message if coming from the signup page
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("studentId");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    setError(null);
    setSuccessMessage(null);
  
    if (!email || !password) {
      setError("Please fill up both fields");
      return;
    }

    setLoading(true); // Set loading to true before making the request

  
    try {
      const response = await loginUser(email, password);
      if (response.token) {
        localStorage.setItem("token", response.token);  // Store token in localStorage
        localStorage.setItem("studentId", response.studentId); 
        localStorage.setItem("userId", response.userId); // Store studentId in localStorage
        setSuccessMessage("Login successful!");
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } else {
        setError("Invalid email or password.");
      }
    } catch (error) {
      setError("Invalid Credentials!");
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };
  

  const loginUser = async (email: string, password: string) => {
    const response = await fetch(`${backendUrl}/api/authStudents/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error("Login failed");
    }
  
    const data = await response.json();
    
    // Store the token and userId in localStorage
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId); // Store userId
      localStorage.setItem("studentId", data.studentId); // Store studentId
      console.log("Stored userId in localStorage:", data.userId);  // Debugging line
    }
    
    
    return data; // Return data containing the user info and token
  };
  
  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email first.");
      return;
    }
  
    try {
      const response = await fetch(`${backendUrl}/api/authStudents/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setSuccessMessage("Password has been reset to '123'. Please log in with the new password.");
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error(error);
      setError("Server error. Please try again later.");
    }
  };
  

  return (
    <div className={styles.loginContainer}>
      <div className={styles.imageContainer}>
      </div>
      <div className={styles.loginForm}>

      <div className ={styles.logoimg}></div>
        <h1 className={styles.welcomelog}>Welcome to DiscoverU!</h1>
        <h3 className={styles.welcomelogdesc}>Login to continue access</h3>

        {error && <p className={styles.errorMessage}>{error}</p>}
        {successMessage && (
          
          <p className={styles.successMessage}>{successMessage}</p>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className={styles.logLabel}>
            Email:
          </label>
          <input
            className={styles.logInput}
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password" className={styles.logLabel}>
            Password:
          </label>
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
          <button type="submit" className={styles.submitButtonLog} disabled={loading}>
            {loading ? "Logging in, please wait..." : "Login"}
          </button>

          <p onClick={() => navigate("/forgot-password")} className={styles.forgotPasswordLink}>
            Forgot Password?
          </p>


          <h1 className={styles.Signuplink_info}>
            Don't have an account? <span onClick={() => navigate("/signup")} className={styles.Signuplink} > Sign Up </span>
          </h1>
        </form>
      </div>
    </div>
  );
};

export default Login;
