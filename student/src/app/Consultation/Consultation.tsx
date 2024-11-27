import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Consultation.module.scss";
import { v4 as uuidv4 } from 'uuid'; // Install with `npm install uuid`

interface Consultation {
  userId: string;
  date: string;
  timeForConsultation: string;
  note: string;
  status: string;
}


const API_URL = "http://localhost:5000/api/consult/";
const USERIQ_URL = "http://localhost:5000/api/useriq/";
const USERPF_URL = "http://localhost:5000/api/user16pf/user/";
const USERIQOMRE_URL = "http://localhost:5000/api/omr/"
const USERPFOMRE_URL = "http://localhost:5000/api/omr16pf/"

const ConsultationRequestForm: React.FC = () => {
  const [userId, setUserID] = useState("");
  const [timeForConsultation, setTimeForConsultation] = useState("");
  const [note, setNote] = useState<"IQ Test (Online)" | "IQ Test (Physical)" | "Personality Test (Physical)" | "Personality Test (Online)" | "Others" | "">("");
  const [testIDs, setTestIDs] = useState<string[]>([]); // To store fetched test IDs
  const [selectedTestID, setSelectedTestID] = useState<string>(""); // For selected test ID
  const [date, setDate] = useState("");
  const [consultations, setConsultation] = useState<Consultation[]>([]);
  
  // Fields for "Others"
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [sex, setSex] = useState<"Male" | "Female" | "">("");
  const [course, setCourse] = useState<"BSCS" | "BSIT" | "BSCrim" | "BSHRM" | "BSEDUC" | "BSP" | "">("");
  const [year, setYear] = useState<1 | 2 | 3 | 4 | "">("");
  const [section, setSection] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | "">("");
  const [reasonForConsultation, setReasonForConsultation] = useState("");

  useEffect(() => {
    if (note !== "Others") {
      // Reset fields to default values
      setFirstName("N/A");
      setLastName("N/A");
      setAge(1);
      setSex("");
      setCourse("");
      setYear(1);
      setSection(1);
      setReasonForConsultation("N/A");
    } else {
      // Clear fields for user input
      setFirstName("");
      setLastName("");
      setAge("");
      setSex("");
      setCourse("");
      setYear("");
      setSection("");
      setReasonForConsultation("");
    }
  }, [note]);
  

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
      const currentTime = new Date();
      const formattedTime = `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`;
      const generatedTestID = `${formattedTime}-${uuidv4()}`; // Unique ID with current time and UUID
      setSelectedTestID(generatedTestID);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const consultationRequest = {
        userId,
        timeForConsultation,
        note,
        testID: selectedTestID,
        date,
        firstName: firstName || "N/A",
        lastName: lastName || "N/A",
        age: age || 1,
        sex: sex || "N/A",
        course: course || "N/A",
        year: year || 1,
        section: section || 1,
        reasonForConsultation: reasonForConsultation || "N/A",
      };
      console.log("Request data:", consultationRequest);

      
  
      await axios.post(API_URL, consultationRequest);
      alert("Consultation request submitted successfully.");

      window.location.reload();
    } catch (error) {
      console.error("Error submitting consultation request:", error);
      alert("ERROR: Consultation request with this test ID already exists.");
    }
  };

  useEffect(() => {
    // Fetch userId from localStorage
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserID(storedUserId);
      fetchConsultations(storedUserId);
    }
  }, []);

  const fetchConsultations = async (id: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/consult/user/${id}`);
      if (response?.data?.data) {
        setConsultation(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching consultations:", error);
    }
  };
  

  return (
    <div className={styles.consultMain}>
    <div className={styles.consulForm}>
      <div className={styles.consultContainer}>
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
              min={new Date().toISOString().split('T')[0]}  // Restrict to today and future dates
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

          {(note === "IQ Test (Online)" || note === "IQ Test (Physical)" || note === "Personality Test (Online)" || note === "Personality Test (Physical)") && testIDs.length > 0 && (
            <label className={styles.conLabel}>
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

          {note === "Others" && (
            <>
              <label className={styles.conLabel}>
                First Name
                <input
                  className={styles.conInput}
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  disabled={note !== "Others"}

                />
              </label>

              <label className={styles.conLabel}>
                Last Name
                <input
                  className={styles.conInput}
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  disabled={note !== "Others"}

                />
              </label>

              <label className={styles.conLabel}>
                Age
                <input
                  className={styles.conInput}
                  type="number"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) )} // Parse the input as an integer or set to 0 if empty
                  required
                  disabled={note !== "Others"}

                />
              </label>

              


              <label className={styles.conLabel}>
                Sex
                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value as "Male" | "Female")}
                  required
                  disabled={note !== "Others"}

                >
                  <option value="" disabled>Select Sex</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </label>

              <label className={styles.conLabel}>
                Course
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value as "BSCS" | "BSIT" | "BSCrim" | "BSHRM" | "BSEDUC" | "BSP")}
                  required
                  disabled={note !== "Others"}

                >
                  <option value="" disabled>Select Course</option>
                  <option value="BSCS">BSCS</option>
                  <option value="BSIT">BSIT</option>
                  <option value="BSCrim">BSCrim</option>
                  <option value="BSHRM">BSHRM</option>
                  <option value="BSEDUC">BSEDUC</option>
                  <option value="BSP">BSP</option>
                </select>
              </label>

              <label className={styles.conLabel}>
                Year
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value) as 1 | 2 | 3 | 4)}
                  required
                  disabled={note !== "Others"}

                >
                  <option value="" disabled>Select Year</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                </select>
              </label>

              <label className={styles.conLabel}>
                Section
                <select
                  value={section}
                  onChange={(e) => setSection(Number(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9)}
                  required
                  disabled={note !== "Others"}

                >
                  <option value="" disabled>Select Section</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                  <option value={7}>7</option>
                  <option value={8}>8</option>
                  <option value={9}>9</option>
                </select>
              </label>

              <label className={styles.conLabel}>
                Reason for Consultation
                <input
                  className={styles.conInput}
                  type="text"
                  value={reasonForConsultation}
                  onChange={(e) => setReasonForConsultation(e.target.value)}
                  required
                  disabled={note !== "Others"}

                />
              </label>
            </>
          )}

          <button type="submit" className={styles.conSubmit}>
            Submit
          </button>
        </form>

        

        
      </div>
      
    </div>

    <div className={styles.tableContainer}>

    <h2>Consultation Records</h2>
    <div className={styles.responsesWrapper}>

    <table className={styles.table}>
      <thead>
        <tr>
          <th>User ID</th>
          <th>Date</th>
          <th>Time for Consultation</th>
          <th>Note</th>
          <th>Status</th>
          <th>Actions</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        {consultations.length > 0 ? (
          consultations.map((consultation) => (
            <tr key={consultation.userId + consultation.date + consultation.timeForConsultation}>
              <td>{consultation.userId}</td>
              <td>{new Date(consultation.date).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  })}</td>
              <td>{consultation.timeForConsultation}</td>
              <td>{consultation.note}</td>
              <td>{consultation.status}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5}>No consultations found</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
  </div>
  </div>
    
  );
};

export default ConsultationRequestForm;
