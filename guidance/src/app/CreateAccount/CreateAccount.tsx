import React, { useState, useEffect } from "react";
import styles from "./CreateAccount.module.scss";
import backendUrl from "../../config";

const CreateAccount: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateUniqueUserId();
  }, []);

  const generateRandomUserId = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const checkUserIdExists = async (id: string) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/authGuidance/guidance/${id}`
      );
      if (response.ok) {
        const data = await response.json();
        return !!data;
      }
    } catch (error) {
      console.error("Error checking User ID:", error);
    }
    return false;
  };

  const generateUniqueUserId = async () => {
    let uniqueId = "";
    let isUnique = false;
    while (!isUnique) {
      uniqueId = generateRandomUserId();
      isUnique = !(await checkUserIdExists(uniqueId));
    }
    setUserId(uniqueId);
    console.log("Generated userId:", uniqueId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      setError("User ID is still being generated. Please wait.");
      return;
    }

    if (!email || !fullName || !role) {
      setError("All fields are required.");
      return;
    }

    setError(null);

    const password = "123"; // Default password

    try {
      const response = await signupUser(email, fullName, password, role, userId);

      console.log(response);

      if (response.message === "sub account created successfully") {
        window.alert("Account created successfully.");
        window.location.reload();
      } else if (response.error === "email_exists") {
        setError("Email already exists. Please log in or use a different email.");
      } else if (response.error === "userId_exists") {
        setError("User ID already exists. Please refresh the page.");
      }
    } catch (error) {
      setError("Sign up failed. Please try again later.");
      console.error(error);
    }
  };

  const signupUser = async (
    email: string,
    fullName: string,
    password: string,
    role: string,
    userId: string
  ) => {
    console.log("Submitting user data:", { email, fullName, password, role, userId });

    const response = await fetch(
      `${backendUrl}/api/authGuidance/subGuidance/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, fullName, password, role, userId }),
      }
    );

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      throw new Error("Sign up failed");
    }

    return data;
  };

  return (
    <div className={styles.signup_page}>
      <div className={styles.signup_container}>
        <h2 className={styles.signup_h2}>Create Account</h2>
        <form onSubmit={handleSubmit} className={styles.signup_form}>
          <div>
            <label className={styles.signuplabel}>
              Email: <span className={styles.required}>*</span>
            </label>
            <input
              className={styles.signupInput}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={styles.signuplabel}>
              Full Name: <span className={styles.required}>*</span>
            </label>
            <input
              className={styles.signupInput}
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={styles.signuplabel}>
              Role: <span className={styles.required}>*</span>
            </label>
            <select
              className={styles.signupInput}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select Role</option>
              <option value="sub">Sub Guidance</option>
              <option value="main">Main Guidance</option>
            </select>
          </div>
          <div>
            <p style={{ color: "red", textAlign: "center" }}>
              Note: Default Password is 123 and can be changed later through their profile.
            </p>
          </div>
          <div>
            <input
              className={styles.hidden}
              type="text"
              value={userId}
              readOnly
            />
          </div>
          <button type="submit" className={styles.signupSubmit}>
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
