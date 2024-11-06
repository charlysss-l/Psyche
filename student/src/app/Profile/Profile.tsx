import React from 'react';
import styles from './studentprofile.module.scss'; // Import the SCSS file

const Profile: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Profile</h1>
      <p className={styles.content}>
        Welcome to your profile page. Here you can view and update your profile information.
      </p>
      <button className={styles.button}>Update Profile</button>
    </div>
  );
};

export default Profile;
