import React, { useState, useEffect } from "react";
import styles from "./CreateAccount.module.scss";
import backendUrl from "../../config";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const CreateAccount: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [role, setRole] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<string>("");

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
        `${backendUrl}/api/authGuidance/guidance/${id}`
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
    console.log("Generated userId:", uniqueId); // Log the generated userId
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

  useEffect(() => {
    generateUniqueUserId();
  }, []); // This will run once when the component mounts
  

  console.log("Generated userId:", userId); // Check the value here before submitting


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
        setError("User ID is still being generated. Please wait.");
        return;
      }
  
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
      const response = await signupUser(email, fullName, password, role, userId);
      
      // Log the response to verify it
      console.log(response);
  
      if (response.message === "sub account created successfully") {
        window.alert("Account created successfully.");
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
    fullName: string,
    password: string,
    role: string,
    userId: string,
  ) => {
    console.log("Submitting user data:", { email, fullName, password, role, userId });
    
    const response = await fetch(`${backendUrl}/api/authGuidance/subGuidance/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, fullName, password, role, userId }),
    });
    
    // Log the response from the server
    const data = await response.json();
    console.log(data); // This will show you the response from the server
    
    if (!response.ok) {
      throw new Error("Sign up failed");
    }
    
    return data; // Return the response data
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
            <label className={styles.signuplabel}>
              Full Name: <span className={styles.required}>*</span>
            </label>
            <input
              className={styles.signupInput}
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={styles.signuplabel}>
              Role: <span className={styles.required}>*</span>
            </label>
            <select
              className={styles.signupInput}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select Role</option>
              <option value="sub">Sub Guidance</option>
              <option value="main">Main Guidance</option>
            </select>
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
          <button type="submit" className={styles.signupSubmit}>
            Sign Up
          </button>
        
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
