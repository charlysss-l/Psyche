import React, { useState, useEffect } from "react";
import style from "./page.module.scss";

const Profile: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Fetch user profile data (including userId) from the server
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Authorization token is missing.");
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
          setUsername(result.email);
        } else {
          setMessage(result.message || "Failed to load profile.");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        setMessage("An error occurred while loading the profile.");
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setErrorMessage(null);

    // Check if the email format is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (username && !emailRegex.test(username)) {
      setErrorMessage("Please enter a valid email format.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Authorization token is missing.");
      return;
    }

    try {
      // Check if the email and password are different from the current ones
      const response = await fetch(
        "http://localhost:5000/api/authStudents/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      if (result.email === username && result.password === password) {
        setErrorMessage("No changes detected. Profile update failed.");
        return;
      }

      const updateResponse = await fetch(
        "http://localhost:5000/api/authStudents/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const updateResult = await updateResponse.json();

      if (updateResponse.ok) {
        setMessage("Profile updated successfully.");
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
        <div className={style.userIDDisplay}>
          UserID: {userId || "Loading..."}
        </div>
        <form onSubmit={handleSubmit}>
          <label className={style.pr_label}>Email</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={style.pr_input}
          />
          <label className={style.pr_label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={style.pr_input}
          />
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
