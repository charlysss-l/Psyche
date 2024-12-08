import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Consultation.module.scss";
import { v4 as uuidv4 } from 'uuid'; // Install with `npm install uuid`
import ArchiveInbox from "./ArchiveInbox";

interface Consultation {
  userId: string;
  date: string;
  testID: string;
  timeForConsultation: string;
  note: string;
  status: string;
  message: string;
}

interface FollowUpSchedule {
  _id: string;
  userId: string;
  followUpDate: string;
  timeForConsultation: string;
  note: string;
  status: string;
  message: string;
}


const API_URL = "http://localhost:5000/api/consult/";
const FOLLOWUP_URL = "http://localhost:5000/api/followup/user/";
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
  const [followUpSchedules, setFollowUpSchedules] = useState<FollowUpSchedule[]>([]);
  const [decliningSchedule, setDecliningSchedule] = useState<string | null>(null);
  const [declineMessage, setDeclineMessage] = useState<string>("");

  const [showArchived, setShowArchived] = useState(false);  // State to toggle the archive list visibility
  const toggleArchivedList = () => {
    setShowArchived(prevState => !prevState);  // Toggle the state
  };

  
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
    // Fetch the follow-up schedules when userId is available
    if (userId) {
      const fetchFollowUpSchedules = async () => {
        try {
          const schedules = await axios.get(`${FOLLOWUP_URL}${userId}`);
            setFollowUpSchedules(schedules.data);
          
        } catch (error) {
          console.error("Error fetching follow-up schedules:", error);
        }
      };

      fetchFollowUpSchedules();
    }
  }, [userId]);


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
        message: "No Message Yet",
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
      alert("Consultation request submitted successfully. Your Result has been shared with the guidance counselor.");

      window.location.reload();
    } catch (error) {
      console.error("Error submitting consultation request:", error);
      alert("You have already scheduled this test.");
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

 

  const deleteConsultation = async (testID: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this consultation?");
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`${API_URL}/test/${testID}/delete`);
      setConsultation((prevConsultations) =>
        prevConsultations.filter((consultation) => consultation.testID !== testID)
      );
      alert("Consultation deleted successfully.");
    } catch (error) {
      console.error("Error deleting consultation:", error);
      alert("Failed to delete consultation.");
    }
  };
  
  
  const cancelConsultation = async (testID: string) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this consultation?");
    if (!confirmCancel) return;

    try {
      await axios.put(`${API_URL}${testID}/cancel`);
      setConsultation((prevConsultations) =>
        prevConsultations.map((consultation) =>
          consultation.testID === testID
            ? { ...consultation, status: "cancelled" }
            : consultation
        )
      );
      alert("Consultation cancelled successfully.");
    } catch (error) {
      console.error("Error cancelling consultation:", error);
      alert("Failed to cancel consultation.");
    }
  };
  
  const handleArchive = async (testID: string) => {
    try {
      // Make an API call to archive the consultation
      await axios.put(`${API_URL}archive/${testID}`);
      setConsultation((prevConsultations) =>
        prevConsultations.map((consultation) =>
          consultation.testID === testID
            ? { ...consultation, status: "archived" }
            : consultation
        )
      );
      alert(" Archived successfully.");
    } catch (error) {
      console.error("Error archiving consultation:", error);
      alert("Failed to archive consultation.");
    }
  };

  const handleAccept = async (id: string) => {
    try {
      await axios.put(`http://localhost:5000/api/followup/${id}`, {
        status: "accepted",
      });
      setFollowUpSchedules((prev) =>
        prev.map((schedule) =>
          schedule._id === id ? { ...schedule, status: "accepted" } : schedule
        )
      );
    } catch (error) {
      console.error("Error accepting follow-up schedule:", error);
    }
  };
  
const handleDecline = (id: string) => {
  // Set the schedule to be declined
  setDecliningSchedule(id);
};

const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setDeclineMessage(event.target.value);
};

const handleSubmitDecline = async (id: string) => {
  if (!declineMessage) {
    alert("You need to provide a message before declining.");
    return;
  }

  try {
    // Send the declined status and message to the backend
    await axios.put(`http://localhost:5000/api/followup/${id}`, {
      status: "declined",
      message: declineMessage,
    });

    // Update the follow-up schedule state to reflect the declined status and message
    setFollowUpSchedules((prev) =>
      prev.map((schedule) =>
        schedule._id === id ? { ...schedule, status: "declined", message: declineMessage } : schedule
      )
    );

    alert("Follow-up request declined and message sent.");
    setDecliningSchedule(null); // Reset declining state
    setDeclineMessage(""); // Reset message input
  } catch (error) {
    console.error("Error declining follow-up schedule:", error);
  }
};

const handleRemove = async (id: string) => {
  try {
    // Call the backend to remove the follow-up schedule
    await axios.delete(`http://localhost:5000/api/followup/${id}`);

    // Update the state to remove the schedule
    setFollowUpSchedules((prev) => prev.filter((schedule) => schedule._id !== id));

    alert("Follow-up schedule removed.");
  } catch (error) {
    console.error("Error removing follow-up schedule:", error);
  }
};
  
  return (
    <div className={styles.consultMain}>
    <div className={styles.consulForm}>
      <div className={styles.consultContainer}>
        <form className={styles.formCon} onSubmit={handleSubmit}>
          <h2 className={styles.conText}>Double Check The Test ID in the Results Page to Check for your Result that you want to be consulted.</h2>
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
    Time for Consultation <br/>
    ***Choose time between 9:00 AM and 5:00 PM***

    <input
        className={styles.conInput}
        type="time"
        value={timeForConsultation}
        onChange={(e) => {
            const selectedTime = e.target.value;
            const [hours, minutes] = selectedTime.split(":").map(Number);
            
            // Check if the selected time is within the allowed range (9 AM to 5 PM)
            if (hours >= 9 && hours < 17) {
                setTimeForConsultation(selectedTime);
            } else {
                alert("Please choose a time between 9:00 AM and 5:00 PM.");
            }
        }}
        required
        min="09:00"
        max="17:00"
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
                  <option value="BSEduc">Bachelor of Secondary Education</option>
                <option value="BSBM">BS Business Management</option>
                <option value="BSCS">BS Computer Science</option>
                <option value="BSCrim">BS Criminology</option>
                <option value="BSHM">BS Hospitality Management</option>                    
                <option value="BSIT">BS Information Technology</option>
                <option value="BSP">BS Psychology</option>
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

    {/* consultation schedules */}
    <div className={styles.tableContainer}>
  <h2 className={styles.consultationlabel}>
    Consultation Schedules
    <button
      className={styles.archiveButton}
      onClick={toggleArchivedList}
    >
      Archive List
    </button>
  </h2>
  {showArchived && <ArchiveInbox />}

  <div className={styles.responsesWrapper}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>User ID</th>
          <th>Date</th>
          <th>Time for Consultation</th>
          <th>Test ID</th>
          <th>Note</th>
          <th>Status</th>
          <th>Actions</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        {consultations.length > 0 ? (
          consultations
            .filter(consultation => consultation.status !== "archived")  
            .map((consultation) => (
              <tr
                key={
                  consultation.userId +
                  consultation.date +
                  consultation.timeForConsultation +
                  consultation.testID
                }
              >
                <td>{consultation.userId}</td>
                <td>
                  {new Date(consultation.date).toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </td>
                <td>{consultation.timeForConsultation}</td>
                <td>{consultation.testID}</td>
                <td>{consultation.note}</td>
                <td>{consultation.status}</td>
                <td>
                  {/* Button logic */}
                  {consultation.status === "completed" ? (
                    <button
                      className={`${styles.actionButton} ${styles.archive}`}
                      onClick={() => handleArchive(consultation.testID)}
                    >
                      Archive
                    </button>
                  ) : consultation.status === "declined" ||
                    consultation.status === "cancelled" ||
                    consultation.status === "removed" ? (
                    <button
                      className={`${styles.actionButton} ${styles.delete}`}
                      onClick={() => deleteConsultation(consultation.testID)}
                    >
                      Delete
                    </button>
                  ) : (
                    <button
                      className={`${styles.actionButton} ${styles.cancel}`}
                      onClick={() => cancelConsultation(consultation.testID)}
                    >
                      Cancel
                    </button>
                  )}
                </td>
                <td>{consultation.message}</td>
              </tr>
            ))
        ) : (
          <tr>
            <td colSpan={7}>No consultations found</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  {/* follow up schedules */}

  <h2 className={styles.consultationlabel}>
  Follow Up Schedules
</h2>

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
      </tr>
    </thead>
    <tbody>
      {followUpSchedules.length > 0 ? (
        followUpSchedules.map((schedule) => (
          <tr key={schedule._id}>
            <td>{schedule.userId}</td>
            <td>{new Date(schedule.followUpDate).toLocaleDateString()}</td>
            <td>{schedule.timeForConsultation}</td>
            <td>{schedule.note}</td>
            <td>{schedule.status}</td>
            <td>
              {schedule.status === "pending" ? (
                <>
                  <button
                    onClick={() => handleAccept(schedule._id)}
                    className={styles.acceptButton}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDecline(schedule._id)}
                    className={styles.declineButton}
                  >
                    Decline
                  </button>
                  {decliningSchedule === schedule._id && (
                    <div>
                      <input
                        type="text"
                        value={declineMessage}
                        onChange={handleMessageChange}
                        placeholder="Enter message for decline"
                      />
                      <button
                        onClick={() => handleSubmitDecline(schedule._id)}
                        className={styles.submitDeclineButton}
                      >
                        Submit Decline
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <span className={styles.statusMessage}>
                  {schedule.status === "accepted"
                 }
                </span>
              )}
              {/* Remove button appears after accepting or declining */}
              {(schedule.status === "accepted" || schedule.status === "declined") && (
                <button
                  onClick={() => handleRemove(schedule._id)}
                  className={styles.removeButton}
                >
                  Remove
                </button>
              )}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={6} className={styles.noData}>
            No follow-up schedules found.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>
</div>
<div>  
</div>
  </div>
  );
};

export default ConsultationRequestForm;
