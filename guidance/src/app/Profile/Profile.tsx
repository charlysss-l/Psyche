import React from 'react';
import style from './psychologyprofile.module.scss';

const Profile = () => {


  return (
    <div className={style.container}>
      <h2 className={style.userinfo_pr}>User Information</h2>
      <div className={style.infoContainer}>
        <div className={style.userIDDisplay}>
          UserID: Display UserID Logic here
        </div>
        <label className={style.pr_label}>Username</label>
        <input
          type="text"
          name="username"
          className={style.pr_input}
        />
        <label className={style.pr_label}>Password</label>
        <input
          type="password"
          name="password"
          className={style.pr_input}
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
