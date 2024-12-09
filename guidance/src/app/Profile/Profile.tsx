import React, { useState } from 'react';
import style from './Guidanceprofile.module.scss';
//This component enables the "Guidance" user to update their password securely.
 //This component handles the profile management of the "Guidance" user. 
 //allow user to update their password 
 //has validation - token based authorization
const Profile: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState<string>(''); // State for confirm password
 
//Handles the form submission for updating the password.
//Validates if the passwords match, retrieves the authorization token, and sends a request to the backend API to update the password.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      setMessage('Authorization token is missing.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/authGuidance/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify({ password }), // Only send password
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
        <label className={style.pr_label}>Email:</label>
        {/* Display username as text, not editable */}
        <p className={style.pr_input}>{'cvsu.guidance@gmail.com'}</p>

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
