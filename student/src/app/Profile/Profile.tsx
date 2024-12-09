import React, { useState, useEffect } from "react";
import style from "./page.module.scss";
import { set } from "mongoose";

//Retrieves user details from a backend server. 
//Ensures all inputs are valid before submission.
//Token based authentication

const Profile: React.FC = () => {
    // State variables for managing form data and messages
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [studentNumber, setStudentNumber] = useState<string>("");
  const [password, setPassword] = useState<string>(""); // New password input
  const [confirmPassword, setConfirmPassword] = useState<string>(""); // Confirm password input
  const [currentEmail, setCurrentEmail] = useState<string>(""); // For displaying current email
  const [currentStudentNumber, setCurrentStudentNumber] = useState<string>(""); // For displaying current student number
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<string>("");


    // Function to fetch the user's profile information from the backend
    const fetchProfile = async () => {
      const token = localStorage.getItem("token"); // Retrieve the authentication token
      if (!token) {
        setMessage("Authorization token is missing."); // Handle missing token
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/authStudents/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        if (response.ok) {
          setUserId(result.userId);
          setCurrentEmail(result.email); // Set current email for display
          setCurrentStudentNumber(result.studentNumber); // Set current student number for display
        } else {
          setMessage(result.message || "Failed to load profile.");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        setMessage("An error occurred while loading the profile.");
      }
    };
useEffect(() => {
    fetchProfile();
  }, []);

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
    setMessage(null);
    setErrorMessage(null);

    if (!username && !studentNumber && !password) {
      setErrorMessage("Please enter at least one new value to update.");
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage(
        "Password must be at least 8 characters, include one uppercase letter, and one special character."
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Authorization token is missing.");
      return;
    }

    try {
      const updateResponse = await fetch(
        "http://localhost:5000/api/authStudents/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username, studentNumber, password }),
        }
      );

      const updateResult = await updateResponse.json();

      if (updateResponse.ok) {
        setMessage("Profile updated successfully.");
        await fetchProfile();
        setUsername("");
        setStudentNumber("");
        setPassword("");  
        setConfirmPassword(""); // Clear password fields
      } else {
        setErrorMessage(updateResult.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className={style.container}>
      <h2 className={style.userinfo_pr}>User Information</h2>
      <div className={style.infoContainer}>
        <div className={style.userIDDisplay}>UserID: {userId || "Loading..."}</div>
        <p>
          <strong>Current Email:</strong> {currentEmail || "Loading..."}
        </p>
        <p>
          <strong>Current Student Number:</strong> {currentStudentNumber || "Loading..."}
        </p>
        <p>
          <strong>Current Password:</strong> ****** 
        </p>
        <form onSubmit={handleSubmit}>
          <label className={style.pr_label}>New Email</label>
          <input
            type="username"
            placeholder="Enter new email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={style.pr_input}
          />
          <label className={style.pr_label}>New Student Number</label>
          <input
            type="userstudentnum"
            placeholder="Enter new student number"
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
            className={style.pr_input}
          />
           <div className={style.passwordRules}>
            <p>Password must:</p>
            <ul>
              <p>* Be at least 8 characters long</p>
              <p>* Contain at least one uppercase letter</p>
              <p>* Contain at least one special character</p>
            </ul>
          </div>
          <label className={style.pr_label}>New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            className={style.pr_input}
          />
           <div className={style.passwordStrengthContainer}> <p>Password Strength: </p><div className={`${style.passwordStrength} ${style[passwordStrength.toLowerCase()]}`}>
   <strong> {passwordStrength}</strong>
</div></div>
          <label className={style.pr_label}>
            Confirm Password: <span className={style.required}>*</span>
          </label>
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={style.pr_input}
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

{errorMessage && <p className={style.updateMessageError}>{errorMessage}</p>}

          <div className={style.buttonContainer}>
            <button type="submit" className={style.submitButton}>
              Update Profile
            </button>
          </div>
        </form>
        {message && <p className={style.updateMessageSuccess}>{message}</p>}
        {errorMessage && (
          <p className={style.updateMessageError}>{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
