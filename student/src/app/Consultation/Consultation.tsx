import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchConsultationRequests } from "../services/consultationservice";
import styles from "./Consultation.module.scss";
import { v4 as uuidv4 } from 'uuid'; // Install with `npm install uuid`
import ArchiveInbox from "./ArchiveInbox";
import backendUrl from "../../config";

interface Consultation {
  userId: string;
  email: string;
  studentName: string;
  councelorName: string;
  date: string;
  testID: string;
  consultationType: string;
  timeForConsultation: string;
  note: string;
  status: string;
  message: string;
}

interface FollowUpSchedule {
  _id: string;
  userId: string;
  studentName: string;
  councelorName: string;
  followUpDate: string;
  timeForConsultation: string;
  note: string;
  status: string;
  message: string;
}

const API_URL = `${backendUrl}/api/consult/`;
const FOLLOWUP_URL = `${backendUrl}/api/followup/user/`;
const USERIQ_URL = `${backendUrl}/api/useriq/`;
const USERPF_URL = `${backendUrl}/api/user16pf/user/`;
const USERIQOMRE_URL = `${backendUrl}/api/omr/`
const USERPFOMRE_URL = `${backendUrl}/api/omr16pf/`

const ConsultationRequestForm: React.FC = () => {
  const [userId, setUserID] = useState("");
  const [timeForConsultation, setTimeForConsultation] = useState("");
  const [consultationType, setConsultationType] = useState("");
  const [note, setNote] = useState<"IQ Test (Online)" | "IQ Test (Physical)" | "Personality Test (Physical)" | "Personality Test (Online)" | "Others" | "">("");
  const [testIDs, setTestIDs] = useState<string[]>([]); // To store fetched test IDs
  const [selectedTestID, setSelectedTestID] = useState<string>(""); // For selected test ID
  const [date, setDate] = useState("");
  const [email, setEmail] = useState<string>(""); // For displaying current email
  const [studentName, setStudentName] = useState("");
  const [consultations, setConsultation] = useState<Consultation[]>([]);
  const [allConsultations, setAllConsultations] = useState<Consultation[]>([]);
  const [followUpSchedules, setFollowUpSchedules] = useState<FollowUpSchedule[]>([]);
  const [decliningSchedule, setDecliningSchedule] = useState<string | null>(null);
  const [declineMessage, setDeclineMessage] = useState<string>("");
  const [showArchived, setShowArchived] = useState(false);  // State to toggle the archive list visibility
  const toggleArchivedList = () => {
    setShowArchived(prevState => !prevState);  // Toggle the state
  };

  // Fields for "Others"
  const [age, setAge] = useState<number | "">("");
  const [sex, setSex] = useState<"Male" | "Female" | "">("");
  const [course, setCourse] = useState<"BSCS" | "BSIT" | "BSCrim" | "BSHRM" | "BSEDUC" | "BSP" | "">("");
  const [year, setYear] = useState<1 | 2 | 3 | 4 | "">("");
  const [section, setSection] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | "">("");
  const [reasonForConsultation, setReasonForConsultation] = useState("");

  useEffect(() => {
    if (note !== "Others") {
      // Reset fields to default values
 
      setAge(1);
      setSex("");
      setCourse("");
      setYear(1);
      setSection(1);
      setReasonForConsultation("N/A");
    } else {

      // Clear fields for user input
      setAge("");
      setSex("");
      setCourse("");
      setYear("");
      setSection("");
      setReasonForConsultation("");
    }
  }, [note]);

  // fetch all consultation requests
  useEffect(() => {
    const fetchAllConsultationRequests = async () => {
      try {
        const requests = await fetchConsultationRequests();
        setAllConsultations(requests);
      } catch (error) {
        console.error("Error loading consultation requests:", error);
      }
    };
    fetchAllConsultationRequests();
  }, []);
  

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
      const intervalId = setInterval(fetchFollowUpSchedules, 5000); // Poll every 5 seconds

      return () => clearInterval(intervalId); // Cleanup interval on component unmount
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

  // Function to fetch the user's email
  const fetchEmail = async () => {
    const token = localStorage.getItem("token"); // Retrieve the authentication token
    if (!token) {
      return;
    }

    try {
      const response = await fetch(
       `${backendUrl}/api/authStudents/profile`,
       {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );
      const result = await response.json();
      if (response.ok) {
        setEmail(result.email); // Set current email for display
      } 
    } catch (error) {
      console.error("Error loading profile:", error);

    }
  };
useEffect(() => {
  fetchEmail();
}, []);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const councelorName = "pending"; // Default password

    try {
      const consultationRequest = {
        userId,
        email,
        studentName,
        councelorName,
        consultationType,
        timeForConsultation,
        note,
        testID: selectedTestID,
        date,
        message: "No Message Yet",
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
    } catch (error: any) {
      console.error("Error submitting consultation request:", error);

      // Check if the error response contains a message
    if (error.response && error.response.data && error.response.data.message) {
      alert(error.response.data.message);
    } else {
      alert("An unexpected error occurred. Please try again.");
    }
   }
  };

  useEffect(() => {
    // Fetch userId from localStorage
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserID(storedUserId);
      fetchConsultations(storedUserId); // Initial fetch
  
      // Set up polling for real-time updates
      const intervalId = setInterval(() => {
        fetchConsultations(storedUserId);
      }, 5000); // Poll every 5 seconds
  
      // Cleanup on component unmount
      return () => clearInterval(intervalId);
    }
  }, []);
  
  const fetchConsultations = async (id: string) => {
    try {
      const response = await axios.get(`${backendUrl}/api/consult/user/${id}`);
      if (response?.data?.data) {
        setConsultation((prevConsultations) => {
          // Update state only if the data has changed
          const isChanged = 
            JSON.stringify(prevConsultations) !== JSON.stringify(response.data.data);
          return isChanged ? response.data.data : prevConsultations;
        });
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
      await axios.put(`${backendUrl}/api/followup/${id}`, {
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
    await axios.put(`${backendUrl}/api/followup/${id}`, {
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
    await axios.delete(`${backendUrl}/api/followup/${id}`);

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
          <h2 className={styles.conTitle}>Consultation Form</h2>
          <p className={styles.conText}>Double Check The Test ID in the Results Page to Check for your Result that you want to be consulted.</p>
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
            Full Name 
            <input
              className={styles.conInput}
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
            />
          </label>

          <label className={styles.conLabel}>
            Consultaion Type
            <select
              className={styles.conInput}
              value={consultationType}
              onChange={(e) => setConsultationType(e.target.value)}
              required
            >
              <option value="">Select Consultation Type</option>
              <option value="Online">Online</option>
              <option value="F2F">Face To Face</option>
            </select> 
          </label>

          <label className={styles.conLabel}>
            Date (Mon - Fri only available except holidays)  
            <input
              className={styles.conInput}
              type="date"
              value={date}
              onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                // Check if the selected date is a Saturday (6) or Sunday (0)
                if (selectedDate.getDay() === 6 || selectedDate.getDay() === 0) {
                  alert("Weekends (Saturday and Sunday) are not allowed.");
                  // Reset the date to the previous valid date if the weekend is selected
                  return;
                }
                setDate(e.target.value);
              }}
              required
              min={new Date().toISOString().split('T')[0]} // Restrict to today and future dates
              style={{
                color: allConsultations.filter(
                  (consultation) =>
                    new Date(consultation.date).toISOString().split('T')[0] === date
                ).length >= 5
                  ? "red"
                  : "black", // Color the input text red if the date has 5 or more consultations
              }}
            />
          </label>


            {allConsultations.filter(
              (consultation) =>
                new Date(consultation.date).toISOString().split('T')[0] === date
            ).length >= 5 && (
              <p style={{ color: "red" }}>
                This date is fully booked. Please select a different date.
              </p>
            )}

          <label className={styles.conLabel}>
            Time for Consultation <span style={{ color: "red" }}>( If Time is Red it is Reserved and Cannot be Selected )</span>
            <select
              value={timeForConsultation}
              onChange={(e) => setTimeForConsultation(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Time
              </option>
              {[
                "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", 
                "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", 
                "3:30 PM", "4:00 PM"
              ].map((time) => {
                const isReserved = allConsultations.some(
                  (consultation) =>
                    new Date(consultation.date).toISOString().split('T')[0] === date &&
                    consultation.timeForConsultation === time
                );
                return (
                  <option
                    key={time}
                    value={isReserved ? "" : time} // Disable selection for reserved times
                    style={{
                      color: isReserved ? "red" : "black", // Color reserved times in red
                    }}
                    disabled={isReserved} // Make reserved times unselectable
                  >
                    {time}
                  </option>
                );
              })}
            </select>
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

          <button type="submit" className={styles.conSubmit}
           disabled={
            allConsultations.filter(
              (consultation) =>
                new Date(consultation.date).toISOString().split('T')[0] === date
            ).length >= 5
          }
          >
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
          <th>Name</th>
          <th>Date</th>
          <th>Time for Consultation</th>
          <th>Test ID</th>
          <th>Note</th>
          <th>Counselor Name</th>
          <th>Consultation Type</th>
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
                <td>{consultation.studentName}</td>
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
                <td>{consultation.councelorName}</td>
                <td>{consultation.consultationType  !== "Online" && consultation.consultationType}
                    {consultation.consultationType === "Online" && (
                      <button
                        className={`${styles.viewButton} ${consultation.status !== "accepted" ? styles.disabledButton : ""}`}
                        onClick={() => {
                          if (consultation.status === "accepted") {
                            window.location.href = `/online-consult/${consultation.testID}`;
                          } else {
                            alert("The consultation is not yet accepted. Wait for the counselor to accept the request.");
                          }
                        }}
                      >
                        View Online Consultation
                      </button>
                    )}
                  </td>


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
                <td>{consultation.message} </td>
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
        <th>Councelor Name</th>
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
            <td>{schedule.councelorName}</td>
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
