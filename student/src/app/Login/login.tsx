import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Studentlogin.module.scss";
import backendUrl from "../../config";

//  Handles user input (email, password), error, and success messages.
//  Sends user credentials to the server, processes the response, and stores important data in localStorage.


const Login: React.FC = () => {
     // State variables for email, password, error messages, and success messages
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();  // Used to navigate to different routes
  const location = useLocation();  // Provides access to the current location object

  // Show success message if coming from the signup page
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    setError(null);
    setSuccessMessage(null);
  
    if (!email || !password) {
      setError("Please fill up both fields");
      return;
    }
  
    try {
      const response = await loginUser(email, password);
      if (response.token) {
        setSuccessMessage("Login successful!");
        localStorage.setItem("token", response.token);  // Store token in localStorage
        localStorage.setItem("studentId", response.studentId); 
        localStorage.setItem("userId", response.userId); // Store studentId in localStorage
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } else {
        setError("Invalid email or password.");
      }
    } catch (error) {
      setError("Invalid Credentials!");
      console.error(error);
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
  


  return (
    <div className={styles.loginContainer}>
      <div className={styles.imageContainer}></div>
      <div className={styles.loginForm}>
        <h1 className={styles.loginForm_h1}>Welcome to DiscoverU!</h1>
        <h2 className={styles.loginForm_h2}>Login</h2>

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
          <input
            className={styles.logInput}
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className={styles.submitButtonLog}>
            Login
          </button>

          <h1 className={styles.Signuplink_info}>
            Don't have an account? <span onClick={() => navigate("/signup")} className={styles.Signuplink} > Sign Up </span>
          </h1>
        </form>
      </div>
    </div>
  );
};

export default Login;
