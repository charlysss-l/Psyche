import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Studentlogin.module.scss";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    const isLoginSuccessful = await mockLogin(email, password);

    if (isLoginSuccessful) {
      navigate("/dashboard");
    } else {
      setError("Invalid email or password.");
    }
  };

  const mockLogin = async (email: string, password: string): Promise<boolean> => {
    return email === "user@example.com" && password === "password123";
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
