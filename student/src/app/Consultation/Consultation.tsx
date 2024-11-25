import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Consultation.module.scss";

const API_URL = "http://localhost:5000/api/consult/";
const USERIQ_URL = "http://localhost:5000/api/useriq/";
const USERPF_URL = "http://localhost:5000/api/user16pf/user/";
const USERIQOMRE_URL = "http://localhost:5000/api/omr/"

const ConsultationRequestForm: React.FC = () => {
  const [userId, setUserID] = useState("");
  const [timeForConsultation, setTimeForConsultation] = useState("");
  const [note, setNote] = useState<"IQ Test" | "Personality Test" | "Others" | "">(
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
      let iqTestIDs: string[] = [];
      let omrTestIDs: string[] = [];

       // Fetch IQ test IDs
       if (note === "IQ Test") {
        const iqResponse = await axios.get(`${USERIQ_URL}${userId}`);
        iqTestIDs = iqResponse.data?.data.map(
          (test: { testID: string }) => test.testID
        ) || [];

        // Fetch OMR test IDs
        const omrResponse = await axios.get(`${USERIQOMRE_URL}${userId}`);
        omrTestIDs = omrResponse.data?.data.map(
          (test: { testID: string }) => test.testID
        ) || [];
      } else if (note === "Personality Test") {
        const pfResponse = await axios.get(`${USERPF_URL}${userId}`);
        iqTestIDs = pfResponse.data?.data.map(
          (test: { testID: string }) => test.testID
        ) || [];
      }

      // Combine both IQ and OMR test IDs if available
      setTestIDs([...iqTestIDs, ...omrTestIDs]);
    } catch (error) {
      console.error("Error fetching test IDs:", error);
      setTestIDs([]);
    }
  };

  if (note === "IQ Test" || note === "Personality Test") {
    fetchTestIDs();
  }
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
              setNote(e.target.value as "IQ Test" | "Personality Test" | "Others")
            }
            required
          >
            <option value="" disabled>
              Select Your Concern
            </option>
            <option value="IQ Test">IQ Test</option>
            <option value="Personality Test">Personality Test</option>
            <option value="Others">Others</option>
          </select>
        </label>

        {(note === "IQ Test" || note === "Personality Test") &&
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
