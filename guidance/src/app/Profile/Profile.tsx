import React, { useEffect, useState } from 'react';
import style from './Guidanceprofile.module.scss';
import backendUrl from "../../config";

const Profile: React.FC = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [role, setRole] = useState<string | null>(null);

  // Fetch the email and role from localStorage when the component mounts
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedUserId = localStorage.getItem("userId");
    const storedFullName = localStorage.getItem("fullName");
    const storedRole = localStorage.getItem("role");  // Fetch the role

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
      setMessage('Passwords do not match.');
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      setMessage('Authorization token is missing.');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/authGuidance/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Profile updated successfully.');
      } else {
        setMessage(result.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className={style.container}>
      <h2 className={style.userinfo_pr}>Guidance Profile</h2>
      <form onSubmit={handleSubmit} className={style.infoContainer}>

        {role !== 'main' && (
          <>
            <label className={style.pr_label}>User ID:</label>
            {/* Display userId fetched from localStorage */}
            <p className={style.pr_input}>{userId}</p>

            <label className={style.pr_label}>Name:</label>
            {/* Display fullName fetched from localStorage */}
            <p className={style.pr_input}>{fullName}</p>
          </>
        )}

        <label className={style.pr_label}>Email:</label>
        {/* Display email fetched from localStorage */}
        <p className={style.pr_input}>{email}</p>

        <label className={style.passWord}>* Change Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={style.pr_input}
          required
        />

        <label className={style.passWord}>* Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={style.pr_input}
          required
        />

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
