import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./forgotPassword.module.scss";
import backendUrl from "../../../config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/authStudents/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          "Password reset successfully. Your new password is '123'. You can change it later in your profile."
        );
        setTimeout(() => navigate("/login"), 3000); // Redirect to login after 3 seconds
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error(error);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className={styles["forgot-password-container"]}>
      <h2>Forgot Password</h2>
      {message && <p className={styles.success}>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleResetPassword} className={styles.buttonPrimary}>
        Reset Password
      </button>
      <button onClick={() => navigate("/login")} className={styles.buttonSecondary}>
        Back to Login
      </button>
    </div>
  );
};

export default ForgotPassword;
