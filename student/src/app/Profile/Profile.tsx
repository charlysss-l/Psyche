import React, { useState, useEffect } from "react";
import style from "./page.module.scss";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import backendUrl from "../../config";

const Profile: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [studentNumber, setStudentNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [currentEmail, setCurrentEmail] = useState<string>("");
  const [currentStudentNumber, setCurrentStudentNumber] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Authorization token is missing.");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/authStudents/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        setUserId(result.userId);
        setCurrentEmail(result.email);
        setCurrentStudentNumber(result.studentNumber);
      } else {
        setMessage(result.message || "Failed to load profile.");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setMessage("An error occurred while loading the profile. Please ReLogin.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>_\-]).{8,}$/;
    return regex.test(password);
  };

  const evaluatePasswordStrength = (password: string) => {
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

    if (password || confirmPassword) {
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
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Authorization token is missing.");
      return;
    }

    try {
      const updateResponse = await fetch(`${backendUrl}/api/authStudents/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, studentNumber, password }),
      });

      const updateResult = await updateResponse.json();

      if (updateResponse.ok) {
        setMessage("Profile updated successfully.");
        await fetchProfile();
        setUsername("");
        setStudentNumber("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setErrorMessage(updateResult.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className={style.outcontainer}>
      {/* Student Information Section */}
      <h2 className={style.userinfo_pr}>Student Information</h2>
      <div className={style.container}>
        <div className={style.infoContainer}>
          <div className={style.userIDDisplay}>UserID: {userId || "Loading..."}</div>
          <p className={style.pr_labelName}>
            <strong className={style.pr_labelcurrent}>Email:</strong> {currentEmail || "Loading..."}
          </p>
          <p className={style.pr_labelName}>
            <strong className={style.pr_labelcurrent}>Student Number:</strong> {currentStudentNumber || "Loading..."}
          </p>

          <form onSubmit={handleSubmit}>
            <label className={style.pr_label}>New Email</label>
            <input
              type="email"
              placeholder="Enter new email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={style.pr_input}
            />
            <label className={style.pr_label}>New Student Number</label>
            <input
              type="id"
              placeholder="Enter new student number"
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)}
              className={style.pr_input}
            />

            {/* Submit button for student info */}
            <div className={style.buttonContainer}>
              <button type="submit" className={style.submitButton}>
                Save Changes
              </button>
            </div>
          </form>
          {message && <p className={style.updateMessageSuccess}>{message}</p>}
        </div>
      </div>

      {/* Change Password Section */}
      <h2 className={style.changePasswordTitle}>Change Password</h2>
      <div className={style.passcontainer}>
        <div className={style.passwordContainer}>
          <form onSubmit={handleSubmit}>
            <label className={style.pr_label}>New Password</label>
            <div className={style.passwordInputContainer}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                className={style.pr_input}
              />
              <button
                type="button"
                className={style.togglePasswordButton}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className={style.passwordStrengthContainer}>
              <p>Password Strength:</p>
              <div className={`${style.passwordStrength} ${style[passwordStrength.toLowerCase()]}`}>
                <strong>{passwordStrength}</strong>
              </div>
            </div>

            <label className={style.pr_label}>Confirm Password</label>
            <div className={style.passwordInputContainer}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={style.pr_input}
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
                className={style.togglePasswordButton}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errorMessage && <p className={style.updateMessageError}>{errorMessage}</p>}

            {/* Submit button for password change */}
            <div className={style.buttonContainer}>
              <button type="submit" className={style.submitButton}>
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
