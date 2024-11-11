import React, { useState } from 'react';
import style from './psychologyprofile.module.scss';

const Profile: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      setMessage('Authorization token is missing.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/update', {
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
      <h2 className={style.userinfo_pr}>Admin Profile</h2>
      <form onSubmit={handleSubmit} className={style.infoContainer}>
        <label className={style.pr_label}>Username</label>
        {/* Display username as text, not editable */}
        <p className={style.pr_input}>{'cvsu.psychologydepartment@gmail.com'}</p>

        <label className={style.pr_label}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
