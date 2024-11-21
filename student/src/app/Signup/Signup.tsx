import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./studentsignup.module.scss";

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!email || !password || !userId) {
      setError("Please fill up all fields");
      return;
    }

    // Check if userId is exactly 8 digits
    if (userId.length !== 8 || isNaN(Number(userId))) {
      setError("User ID must be exactly 8 digits.");
      return;
    }

    try {
      const response = await signupUser(email, password, userId);

      // Check if the message is a success or handle known errors
      if (response.message === "Student created successfully") {
        navigate("/", {
          state: { message: "Signup successful! Please log in." },
        });
      } else if (response.error === "email_exists") {
        setError(
          "Email already exists. Please log in or use a different email."
        );
      } else if (response.error === "userId_exists") {
        setError("User ID already exists. Please choose a different User ID.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error(error);
    }
  };

  const signupUser = async (
    email: string,
    password: string,
    userId: string
  ) => {
    const response = await fetch(
      "http://localhost:5000/api/authStudents/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, userId }),
      }
    );

    if (!response.ok) {
      throw new Error("Sign up failed");
    }

    return response.json();
  };

  return (
    <div className={styles.signup_container}>
      <h2 className={styles.signup_h2}>Sign Up</h2>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.signup_form}>
        <div>
          <label className={styles.signuplabel}>Email:</label>
          <input
            className={styles.signupInput}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={styles.signuplabel}>Password:</label>
          <input
            className={styles.signupInput}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={styles.signuplabel}>User ID:</label>
          <input
            className={styles.signupInput}
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.signupSubmit}>
          Sign Up
        </button>
        <h4 className={styles.loginLink_info}>
          Already have an account?{" "}
          <span onClick={() => navigate("/")} className={styles.loginLink}>
            Log in
          </span>
        </h4>
      </form>
    </div>
  );
};

export default SignupForm;
