import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./pagelogin.module.scss";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success message

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      const response = await loginUser(email, password);
      
      if (response.token) {
        // Store the token in localStorage or sessionStorage
        localStorage.setItem("token", response.token);

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
    const response = await fetch("http://localhost:5000/api/authGuidance", {
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


  return (
    <div className={styles.loginContainer}>
      <div className={styles.imageContainer}></div>
      <div className={styles.loginForm}>
        <h1 className={styles.loginForm_h1}>Welcome Back!</h1>
        <h2 className={styles.loginForm_h2}>Login</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}
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

          <h1 className={styles.Signuplink_info}>Don't have an account? <Link to="/signup" className={styles.Signuplink}>Sign Up</Link></h1>
        </form>
      </div>
    </div>
  );
};

export default Login;
