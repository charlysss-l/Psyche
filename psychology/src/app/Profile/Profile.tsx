import React from 'react';
import style from './page.module.scss';

const Profile = () => {


  return (
    <div className={style.container}>
      <h2>User Information</h2>
      <div className={style.infoContainer}>
      <label>UserID</label>
        <input
          type="userID"
          name="userID"
        />
        <label>Username</label>
        <input
          type="text"
          name="username"
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
        />
        <div className={style.buttonContainer}>
        
            <button  className={style.submitButton}>
              Submit
            </button>

        </div>
      </div>
    </div>
  );
};

export default Profile;
