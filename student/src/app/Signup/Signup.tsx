import React, { useState } from 'react';
import styles from './studentsignup.module.scss';


const SignupForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // You can handle the signup logic here, like making an API call to submit the form data
    console.log('Submitted', { email, password, userId });
  };

  return (
    <div className={styles.signup_container}>
      <h2 className={styles.signup_h2}>Sign Up</h2>
      <form onSubmit={handleSubmit} className={styles.signup_form}>
        <div>
          <label className={styles.signuplabel}>Email:</label>
          <input
            className={styles.signupInput}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={styles.signuplabel}>Password:</label>
          <input
            className={styles.signupInput}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={styles.signuplabel}>User ID:</label>
          <input
            className={styles.signupInput}
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.signupSubmit}>Sign Up</button>
      </form>
    </div>
  );
};

export default SignupForm;
