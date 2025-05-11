import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./studentsignup.module.scss";
import backendUrl from "../../config";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [studentNumber, setStudentNumber] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<string>("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  

  useEffect(() => {
    generateUniqueUserId();
  }, []);

  const generateRandomUserId = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  const checkUserIdExists = async (id: string) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/authStudents/students/${id}`
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

    if (
      password.length >= 8 &&
      hasUpperCase.test(password) &&
      hasSpecialChar.test(password)
    ) {
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
      setError("Password must be at least 8 characters, include one uppercase letter, and one special character.");
      return;
    }
  
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
  
    setError(null);
    setLoading(true);
  
    try {
      const response = await signupUser(email, password, studentNumber, userId);
  
      if (response.message === "Student created successfully") {
        window.alert("Sign up successful! You can now log in.");
        navigate("/login", {
          state: { message: "Signup successful! Please log in." },
        });
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  const signupUser = async (
    email: string,
    password: string,
    studentNumber: string,
    userId: string
  ) => {
    const response = await fetch(`${backendUrl}/api/authStudents/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, studentNumber, userId }),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.error || "Sign up failed");
    }
  
    return data;
  };
  

  return (
    <div className={styles.signup_page}>
      <div className={styles.signup_container}>
        <h2 className={styles.signup_h2}>Sign Up</h2>
        <p className={styles.signup_p}>create your account</p>
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
            <label className={styles.signuplabel}>Student Number:  <span className={styles.required}>*</span></label>
            <input
                className={styles.signupInput}
                type="text"
                value={studentNumber}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, ""); // Remove non-digits
                  setStudentNumber(numericValue);
                }}
                required
              />
          </div>
          <div>
            <label className={styles.signuplabel}>
              Password: <span className={styles.required}>*</span>
              <div className={styles.passwordRules}>
                <ul>
                  <p>* Be at least 8 characters long</p>
                  <p>* Contain at least one uppercase letter</p>
                  <p>* Contain at least one special character</p>
                </ul>
              </div>
            </label>
            <div className={styles.passwordInputContainer}>
              <input
                className={styles.signupInput}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
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
            <div className={styles.passwordStrengthContainer}>
              {" "}
              <p>Password Strength: </p>
              <div
                className={`${styles.passwordStrength} ${
                  styles[passwordStrength.toLowerCase()]
                }`}
              >
                <strong> {passwordStrength}</strong>
              </div>
            </div>
          </div>
          <div>
            <label className={styles.signuplabel}>
              Confirm Password: <span className={styles.required}>*</span>
            </label>
            <div className={styles.passwordInputContainer}>
              <input
                className={styles.signupInput}
                type={showPassword ? "text" : "password"}
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
              <button
                type="button"
                className={styles.togglePasswordButton}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
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
          <button type="submit" className={styles.signupSubmit} disabled={loading}>
          {loading ? "Signing up, please wait..." : "Sign Up"}
          </button>
          <h4 className={styles.loginLink_info}>
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className={styles.loginLink}
            >
              Log in
            </span>
          </h4>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
