import React, { useEffect, useState } from "react";
import style from "./Guidanceprofile.module.scss";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import backendUrl from "../../config";

const Profile: React.FC = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [role, setRole] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Fetch the email and role from localStorage when the component mounts
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedUserId = localStorage.getItem("userId");
    const storedFullName = localStorage.getItem("fullName");
    const storedRole = localStorage.getItem("role"); // Fetch the role

    console.log("Fetched email from localStorage:", storedEmail); // Debugging log
    if (storedEmail) {
      setEmail(storedEmail); // Set email if it exists
    } else {
      console.log("No email found in localStorage");
    }

    if (storedUserId) {
      setUserId(storedUserId); // Set userId if it exists
    } else {
      console.log("No userId found in localStorage");
    }

    if (storedFullName) {
      setFullName(storedFullName); // Set fullName if it exists
    } else {
      console.log("No fullName found in localStorage");
    }

    if (storedRole) {
      setRole(storedRole); // Set role if it exists
    } else {
      console.log("No role found in localStorage");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Authorization token is missing.");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/authGuidance/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Profile updated successfully.");
      } else {
        setMessage(result.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className={style.container}>
      <h2 className={style.userinfo_pr}>Counselor Profile</h2>
      <form onSubmit={handleSubmit} className={style.infoContainer}>
        {role !== "main" && (
          <>
            <label className={style.pr_labelUserID}>User ID:</label>
            {/* Display userId fetched from localStorage */}
            <p className={style.pr_input}>{userId}</p>
          </>
        )}

        <label className={style.pr_labelemail}>Email:</label>
        {/* Display email fetched from localStorage */}
        <p className={style.pr_input}>{email}</p>

        <label className={style.pr_labelname}>Name:</label>
        {/* Display fullName fetched from localStorage */}
        <p className={style.pr_input}>{fullName}</p>

        <label className={style.passWord}>Change Password:</label>
        <div className={style.passwordInputContainer}>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={style.pr_input}
            required
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
        <label className={style.passWord}>Confirm Password:</label>
        <div className={style.passwordInputContainer}>
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={style.pr_input}
            required
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
        <div className={style.buttonContainer}>
          <button type="submit" className={style.submitButton}>
            Update Password
          </button>
        </div>
        {message && <p className={style.updateMessage}>{message}</p>}
      </form>
    </div>
  );
};

export default Profile;
