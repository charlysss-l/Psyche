import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Consultation.module.scss";

const API_URL = "http://localhost:5000/api/consult/";

const ConsultationRequestForm: React.FC = () => {
  const [userId, setUserID] = useState("");
  const [timeForConsultation, setTimeForConsultation] = useState("");
  const [note, setNote] = useState<"IQ Test" | "Personality Test" | "Others">(
    "IQ Test"
  );
  const [permissionForTestResults, setPermissionForTestResults] =
    useState(false);
  const [date, setDate] = useState("");

  useEffect(() => {
    // Fetch userID from localStorage and set it in state
    const storedUserID = localStorage.getItem('userId');
    if (storedUserID) {
        setUserID(storedUserID);
    }

}, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const consultationRequest = {
        userId,
        timeForConsultation,
        note,
        permissionForTestResults,
        date,
      };
      await axios.post(API_URL, consultationRequest);
      alert("Consultation request submitted successfully.");
    } catch (error) {
      console.error("Error submitting consultation request:", error);
    }
  };

  return (
    <div className={styles.consulForm}>
        <form className={styles.formCon} onSubmit={handleSubmit}>
      <label className={styles.conLabel} >
        User ID
        <input
          className={styles.conInput}
          type="text"
          value={userId} 
          onChange={(e) => setUserID(e.target.value)} 
          required 
          readOnly
        />
      </label>

      <label className={styles.conLabel}>
        Date
        <input
        className={styles.conInput}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </label>

      <label className={styles.conLabel}>
        Time for Consultation
        <input
        className={styles.conInput}
          type="time"
          value={timeForConsultation}
          onChange={(e) => setTimeForConsultation(e.target.value)}
          required
        />
      </label>

      <label className={styles.conLabel}>
        Note
        <select
          value={note}
          onChange={(e) =>
            setNote(e.target.value as "IQ Test" | "Personality Test" | "Others")
          }
          required
        >
          <option value="" disabled>Select Note</option>
          <option value="IQ Test">IQ Test</option>
          <option value="Personality Test">Personality Test</option>
          <option value="Others">Others</option>
        </select>
      </label>

      <label className={styles.conLabel}>
        Permission to Share Test Results
        <input
          className={styles.conLabelCheck}
          type="checkbox"
          checked={permissionForTestResults}
          onChange={(e) => setPermissionForTestResults(e.target.checked)}
        />
      </label>

      <button type="submit" className={styles.submitCon}>Submit Request</button>
    </form>
    </div>
    
  );
};

export default ConsultationRequestForm;
