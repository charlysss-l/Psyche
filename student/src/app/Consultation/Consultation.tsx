import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Consultation.module.scss";

const API_URL = "http://localhost:5000/api/consult/";
const USERIQ_URL = "http://localhost:5000/api/useriq/";
const USERPF_URL = "http://localhost:5000/api/user16pf/user/";
const USERIQOMRE_URL = "http://localhost:5000/api/omr/"
const USERPFOMRE_URL = "http://localhost:5000/api/omr16pf/"

const ConsultationRequestForm: React.FC = () => {
  const [userId, setUserID] = useState("");
  const [timeForConsultation, setTimeForConsultation] = useState("");
  const [note, setNote] = useState<"IQ Test (Online)" | "IQ Test (Physical)" | "Personality Test (Physical)" | "Personality Test (Online)"  | "Others" | "">(
    ""
  );
  const [testIDs, setTestIDs] = useState<string[]>([]); // To store fetched test IDs
  const [selectedTestID, setSelectedTestID] = useState<string>(""); // For selected test ID
  const [date, setDate] = useState("");
  const [consultation, setConsultation] = useState([]);
  


  useEffect(() => {
    // Fetch userID from localStorage and set it in state
    const storedUserID = localStorage.getItem("userId");
    if (storedUserID) {

        setUserID(storedUserID);
    }

}, []);

useEffect(() => {
  // Reset test IDs and selectedTestID when note changes
  setTestIDs([]);
  if (note === "Others") {
    setSelectedTestID("N/A"); // Automatically set to "N/A" for Others
    return;
  } else {
    setSelectedTestID(""); // Reset if not "Others"
  }

  // Fetch test IDs based on the selected note
  const fetchTestIDs = async () => {
    if (!userId) return;

    try {
      let response;
      if (note === "IQ Test (Online)") {
        response = await axios.get(`${USERIQ_URL}${userId}`);
      } else if (note === "IQ Test (Physical)") {
        response = await axios.get(`${USERIQOMRE_URL}${userId}`);
      } else if (note === "Personality Test (Online)") {
        response = await axios.get(`${USERPF_URL}${userId}`);
      } else if (note === "Personality Test (Physical)") {
        response = await axios.get(`${USERPFOMRE_URL}${userId}`);
      }

      if (response?.data?.data) {
        const ids = response.data.data.map(
          (test: { testID: string }) => test.testID
        );
        setTestIDs(ids);
      } else {
        setTestIDs([]);
      }
    } catch (error) {
      console.error("Error fetching test IDs:", error);
      setTestIDs([]);
    }
  };

  fetchTestIDs();
}, [note, userId]);

  const fetchConsultations = async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}${userId}`);
      fetchConsultations(response.data);
    } catch (error) {
      console.error("Error fetching consultations:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const consultationRequest = {
        userId,
        timeForConsultation,
        note,
        testID: selectedTestID, // Include selected test ID
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
      <div className={styles.tableContainer}>
        <form className={styles.formCon} onSubmit={handleSubmit}>
      
      </form>
      <form className={styles.formCon} onSubmit={handleSubmit}>
        <label className={styles.conLabel}>
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
              setNote(e.target.value as "IQ Test (Online)" | "IQ Test (Physical)" | "Personality Test (Online)" | "Personality Test (Physical)" | "Others")
            }
            required
          >
            <option value="" disabled>
              Select Your Concern
            </option>
            <option value="IQ Test (Online)">IQ Test (Online)</option>
            <option value="IQ Test (Physical)">IQ Test (Physical)</option>
            <option value="Personality Test (Online)">Personality Test (Online)</option>
            <option value="Personality Test (Physical)">Personality Test (Physical)</option>
            <option value="Others">Others</option>
          </select>
        </label>

        {(note === "IQ Test (Online)" || note === "IQ Test (Physical)" || note === "Personality Test (Online)" || note === "Personality Test (Physical)") &&
          testIDs.length > 0 && (
            <label className={styles.conLabel} aria-required>
              Select Test ID
              <select
                value={selectedTestID}
                onChange={(e) => setSelectedTestID(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select a Test ID
                </option>
                {testIDs.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </label>
          )}


      <button type="submit" className={styles.submitCon}>Submit Request</button>
    </form>
    <h2>Your Consultation Schedule</h2>
        <table className={styles.consulTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Note</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
           {consultation.map((consult: any) => (
              <tr key={consult._id}>
                <td>{consult.date}</td>
                <td>{consult.timeForConsultation}</td>
                <td>{consult.note}</td>
                <td>{consult.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

    </div>
    </div>
  );
};


export default ConsultationRequestForm;
