import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./pagelogin.module.scss";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill up both fields");
      return;
    }
    try {
      const response = await loginUser(email, password);
      if (response.token) {
        localStorage.setItem("token", response.token);
        setSuccessMessage("Login successful!");
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } else {
        setError("Invalid email or password.");
      }
    } catch (error) {
      const err = error as any;
      setError("Invalid Credentials!");
      console.error(err);
    }
  };

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
      <div className={styles.imageContainer}>
      </div>
      <div className={styles.loginForm}>
        <h1 className={styles.loginForm_h1}>Welcome Back!</h1>
        <h2 className={styles.loginForm_h2}>Login</h2>

        {error && <p className={styles.errorMessage}>{error}</p>}
        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="emailG" className={styles.logLabel}>Email:</label>
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
      </div>
    </div>
  );
};

export default Login;
