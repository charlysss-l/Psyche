import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./studentsignup.module.scss";

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [studentNumber, setStudentNumber] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    generateUniqueUserId();
  }, []);

  const generateRandomUserId = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const checkUserIdExists = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/authStudents/students/${id}`
      );
      if (response.ok) {
        const data = await response.json();
        return !!data; // If data exists, return true
      }
    } catch (error) {
      console.error("Error checking User ID:", error);
    }
    return false; // Default to not existing if an error occurs
  };

  const generateUniqueUserId = async () => {
    let uniqueId = "";
    let isUnique = false;
    while (!isUnique) {
      uniqueId = generateRandomUserId();
      isUnique = !(await checkUserIdExists(uniqueId));
    }
    setUserId(uniqueId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and Password are required.");
      return;
    }

    try {
      const response = await signupUser(email, password, studentNumber, userId);

      if (response.message === "Student created successfully") {
        navigate("/", {
          state: { message: "Signup successful! Please log in." },
        });
      } else if (response.error === "email_exists") {
        setError(
          "Email already exists. Please log in or use a different email."
        );
      } else if (response.error === "userId_exists") {
        setError("User ID already exists. Please refresh the page.");
      }
    } catch (error) {
      setError("Email already exists. Please log in or use a different email.");
      console.error(error);
    }
  };

  const signupUser = async (
    email: string,
    password: string,
    studentNumber: string,
    userId: string
  ) => {
    const response = await fetch(
      "http://localhost:5000/api/authStudents/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, studentNumber, userId }),
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
          <label className={styles.signuplabel}>
            Email: <span className={styles.required}>*</span>
          </label>
          <input
            className={styles.signupInput}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={styles.signuplabel}>Student Number (optional):</label>
          <input
            className={styles.signupInput}
            type="text"
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
          />
        </div>
        <div>
          <label className={styles.signuplabel}>
            Password: <span className={styles.required}>*</span>
          </label>
          <input
            className={styles.signupInput}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            className={styles.hidden}
            type="text"
            value={userId}
            readOnly
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
