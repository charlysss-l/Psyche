import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./forgotPassword.module.scss";
import backendUrl from "../../../config";
import emailjs from "emailjs-com";  // Import EmailJS SDK

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Function to generate a random 3-character password
  const generateRandomPassword = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomPassword = "";
    for (let i = 0; i < 6; i++) {
      randomPassword += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomPassword;
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    const newPassword = generateRandomPassword(); // Generate random password

    try {
      const response = await fetch(`${backendUrl}/api/authStudents/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }), // Send password to backend
      });

      const data = await response.json();

      if (response.ok) {
        sendEmailNotification(email, newPassword); // Send email with password
        setMessage("A new default password has been sent to your email.");
        setTimeout(() => navigate("/login"), 3000); // Redirect after 3 sec
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error(error);
      setError("Server error. Please try again later.");
    }
  };

  const sendEmailNotification = (email: string, newPassword: string) => {
    const templateParams = {
      to_email: email,
      message: `Here is your new default password: ${newPassword} You can change it in you profile after logging in.`,
    };

    emailjs
      .send("service_d3dhmqu", "template_dlok01r", templateParams, "mYvaXjqactIjWQ9O5")
      .then((response: any) => {
        console.log("Email sent successfully:", response);
      })
      .catch((error: any) => {
        console.error("Error sending email:", error);
      });
  };

  return (
    <div className={styles["forgot-password-container"]}>
  <div className={styles["forgot-password-box"]}>
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
</div>

  );
};

export default ForgotPassword;
