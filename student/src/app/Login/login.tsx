import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  // State for email, password, and error messages
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate(); // To navigate after successful login

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    // Call the login function (you would typically call an API here)
    const isLoginSuccessful = await mockLogin(email, password);

    if (isLoginSuccessful) {
      // Redirect to homepage or dashboard on successful login
      navigate("/dashboard");
    } else {
      setError("Invalid email or password.");
    }
  };

  // Mock login function (replace with actual API call)
  const mockLogin = async (email: string, password: string): Promise<boolean> => {
    // Replace this with your authentication logic
    return email === "user@example.com" && password === "password123";
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
