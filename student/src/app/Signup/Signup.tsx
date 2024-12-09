import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./studentsignup.module.scss";

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [studentNumber, setStudentNumber] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<string>("");
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

  const validatePassword = (password: string) => {
     // Use a broader regex that explicitly includes _ as a special character
     const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>_\-]).{8,}$/;
     return regex.test(password);
   };

  const evaluatePasswordStrength = (password: string) => {
    // Regex includes \W (non-word characters) or _ (explicitly checking for underscore)
    const hasSpecialChar = /[\W_]/;
    const hasUpperCase = /[A-Z]/;
  
    if (password.length >= 8 && hasUpperCase.test(password) && hasSpecialChar.test(password)) {
      return "Strong";
    } else if (password.length >= 6 && hasUpperCase.test(password)) {
      return "Medium";
    } else {
      return "Weak";
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordStrength(evaluatePasswordStrength(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters, include one uppercase letter, and one special character."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);

    try {
      const response = await signupUser(email, password, studentNumber, userId);

      if (response.message === "Student created successfully") {
        window.alert("Sign up successful! You can now log in.");
        navigate("/login", {
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
      setError("Sign up failed. Please try again later.");
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
          <label className={styles.signuplabel}>Student Number: *</label>
          <input
            className={styles.signupInput}
            type="studentNumber"
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
            required
          />
        </div>
        <div>
        <div className={styles.passwordRules}>
            <p>Password must:</p>
            <ul>
              <p>* Be at least 8 characters long</p>
              <p>* Contain at least one uppercase letter</p>
              <p>* Contain at least one special character</p>
            </ul>
          </div>
          <label className={styles.signuplabel}>
            Password: <span className={styles.required}>*</span>
          </label>
          <input
            className={styles.signupInput}
            type="password"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            required
          />
          <div className={styles.passwordStrengthContainer}> <p>Password Strength: </p><div className={`${styles.passwordStrength} ${styles[passwordStrength.toLowerCase()]}`}>
   <strong> {passwordStrength}</strong>
</div></div>
          

        </div>
        <div>
          <label className={styles.signuplabel}>
            Confirm Password: <span className={styles.required}>*</span>
          </label>
          <input
            className={styles.signupInput}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{
              borderColor:
                confirmPassword === ""
                  ? ""
                  : confirmPassword === password
                  ? "green"
                  : "red",
            }}
          />
        </div>
        {error && <p className={styles.errorMessage}>{error}</p>}

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
          <span onClick={() => navigate("/login")} className={styles.loginLink}>
            Log in
          </span>
        </h4>
      </form>
    </div>
  );
};

export default SignupForm;
