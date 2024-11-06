import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./pagelogin.module.scss";

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
      <h2>Login</h2>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>Login</button>
      </form>
    </div>
  );
};

export default Login;
