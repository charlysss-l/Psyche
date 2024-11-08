import React, { useState } from "react";
import axios from "axios";
import styles from "./Consultation.module.scss";

const API_URL = "http://localhost:5000/api/consult/";

const ConsultationRequestForm: React.FC = () => {
  const [userId, setUserId] = useState("");
  const [timeForConsultation, setTimeForConsultation] = useState("");
  const [note, setNote] = useState<"IQ Test" | "Personality Test" | "Others">(
    "IQ Test"
  );
  const [permissionForTestResults, setPermissionForTestResults] =
    useState(false);
  const [date, setDate] = useState("");

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
    <form className={styles.formCon} onSubmit={handleSubmit}>
      <label>
        User ID
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
      </label>

      <label>
        Date
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </label>

      <label>
        Time for Consultation
        <input
          type="time"
          value={timeForConsultation}
          onChange={(e) => setTimeForConsultation(e.target.value)}
          required
        />
      </label>

      <label>
        Note
        <select
          value={note}
          onChange={(e) =>
            setNote(e.target.value as "IQ Test" | "Personality Test" | "Others")
          }
          required
        >
          <option value="IQ Test">IQ Test</option>
          <option value="Personality Test">Personality Test</option>
          <option value="Others">Others</option>
        </select>
      </label>

      <label>
        Permission to Share Test Results
        <input
          type="checkbox"
          checked={permissionForTestResults}
          onChange={(e) => setPermissionForTestResults(e.target.checked)}
        />
      </label>

      <button type="submit">Submit Request</button>
    </form>
  );
};

export default ConsultationRequestForm;
