import React from 'react';
import style from './guidanceprofile.module.scss';

const Profile = () => {


  return (
    <div className={style.container}>
      <h3>User Information</h3>
      <div className={style.infoContainer}>
        <div className={style.userIDDisplay}>
          UserID: Display UserID Logic here
        </div>
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
