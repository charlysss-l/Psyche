import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchConsultationRequests } from "../services/consultationservice";
import { fetchFollowUpSchedules } from "../services/followupservice";
import axios from "axios";
import styles from "./Consultation.module.scss";
import ArchiveInbox from "./CompletedInbox";
import backendUrl from "../../config";
import emailjs from "emailjs-com";  // Import EmailJS SDK
import CompleteInbox from "./CompletedInbox";


const API_URL = `${backendUrl}/api/consult/`;
const USERIQ_URL = `${backendUrl}/api/useriq/test/`;
const USERPF_URL = `${backendUrl}/api/user16pf/test/`;
const USERCF_URL = `${backendUrl}/api/usercf/test/`;
const USERIQOMRE_URL = `${backendUrl}/api/omr/test/`;
const USERPFOMRE_URL = `${backendUrl}/api/omr16pf/test/`;
const USERCFOMRE_URL = `${backendUrl}/api/omrcf/test/physical/`;

interface ConsultationRequest {
  counselorCounts(counselorCounts: any): unknown;
  _id: string;
  userId: string;
  email: string;
  studentName: string;
  councelorName: string;
  consultationType: string;
  timeForConsultation: string;
  note: string;
  testID: string;
  date: string;
  status: string;
  message: string;
  acceptedAppointmentCount: number; // Add this field
  allAppointmentsCount: number;
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

const factorDescriptions: Record<string, string> = {
  A: 'Warmth',
  B: 'Reasoning',
  C: 'Emotional Stability',
  E: 'Dominance',
  F: 'Liveliness',
  G: 'Rule-Consciousness',
  H: 'Social Boldness',
  I: 'Sensitivity',
  L: 'Vigilance',
  M: 'Abstractedness',
  N: 'Privateness',
  O: 'Apprehension',
  Q1: 'Openness to Change',
  Q2: 'Self-Reliance',
  Q3: 'Perfectionism',
  Q4: 'Tension',
};

const GuidanceConsultation: React.FC = () => {
  const [consultationRequests, setConsultationRequests] = useState<ConsultationRequest[]>([]);
  const [followUpSchedules, setFollowUpSchedules] = useState<FollowUpSchedule[]>([]);
  const [testDetails, setTestDetails] = useState<any>(null);  // For storing test results
  const [showTestInfo, setShowTestInfo] = useState<boolean>(false);  // To control modal visibility
  const [declineNote, setDeclineNote] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [pendingSearchTerm, setPendingSearchTerm] = useState<string>("");
  const [acceptedSearchTerm, setAcceptedSearchTerm] = useState<string>("");
  const [followUpSearchTerm, setFollowUpSearchTerm] = useState<string>("");
  const [showDeclineModal, setShowDeclineModal] = useState<boolean>(false);
  const [decliningRequestId, setDecliningRequestId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [timeForConsultation, setTimeForConsultation] = useState<string>("");
  const [showArchived, setShowArchived] = useState(false);  
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const toggleCounselorInfo = (userId: string) => {
    setSelectedUserId(selectedUserId === userId ? null : userId);
  };
  
  const openArchivedList = () => {
    setShowArchived(true);  // Only set to true (open), no toggling
  };
  

  useEffect(() => {
    const loadConsultationRequests = async () => {
      try {
        const requests = await fetchConsultationRequests();
        setConsultationRequests(requests);
      } catch (error) {
        console.error("Error loading consultation requests:", error);
      }
    };
    loadConsultationRequests();
    const intervalId = setInterval(loadConsultationRequests, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  useEffect(() => {
    const loadFollowUpSchedules = async () => {
      try {
        const schedules = await fetchFollowUpSchedules();
        setFollowUpSchedules(schedules);
      } catch (error) {
        console.error("Error loading follow-up schedules:", error);
      }
    };
    loadFollowUpSchedules();
    const intervalId = setInterval(loadFollowUpSchedules, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Fetch test details based on testID
  const fetchTestDetails = async (testID: string, note: string) => {
    try {
      let response;
      if (note === "IQ Test (Online)") {
        response = await axios.get(`${USERIQ_URL}${testID}`);	
      } else if (note === "IQ Test (Physical)") {
        response = await axios.get(`${USERIQOMRE_URL}${testID}`);
      } else if (note === "Personality Test (Online)") {
        response = await axios.get(`${USERPF_URL}${testID}`);
      } else if (note === "Personality Test (Physical)") {
        response = await axios.get(`${USERPFOMRE_URL}${testID}`);
      } else if (note === "CF Test (Online)") {
        response = await axios.get(`${USERCF_URL}${testID}`);
      } else if (note === "CF Test (Physical)") {
        response = await axios.get(`${USERCFOMRE_URL}${testID}`);
      } else if (note === "Others") {
        response = await axios.get(`${API_URL}${testID}`);
      }

      if (response?.data) {
        setTestDetails(response.data);
        setShowTestInfo(true);  // Show modal with test details
      } else {
        console.log("No test details found.");
      }
    } catch (error) {
      console.error("Error fetching test details:", error);
    }
  };

  const handleViewInfo = ( testID: string, note: string) => {
    fetchTestDetails( testID, note);
  };

  const filteredPendingUsers = consultationRequests.filter((request) => {
    const normalizedDate = normalizeDate(request.date); // Normalize the date for comparison
    const normalizedSearchTerm = normalizeSearchTerm(pendingSearchTerm); // Normalize the search term
    return [
      request.userId,
      request.studentName,
      request.note,
      request.timeForConsultation,
      normalizedDate,
    ]
    .join(" ")
    .toLowerCase()
    .includes(normalizedSearchTerm.toLowerCase());
  });

  const filteredAcceptedUsers = consultationRequests.filter((request) => {
    const normalizedDate = normalizeDate(request.date); // Normalize the date for comparison
    const normalizedSearchTerm = normalizeSearchTerm(acceptedSearchTerm); // Normalize the search term
    return [
      request.userId,
      request.studentName,
      request.note,
      request.timeForConsultation,
      request.councelorName,
      request.status,
      normalizedDate,
    ]
    .join(" ")
    .toLowerCase()
    .includes(normalizedSearchTerm.toLowerCase());
  });

  const filteredFollowUpUsers = followUpSchedules.filter((schedule) => {
    const normalizedDate = normalizeDate(schedule.followUpDate); // Normalize the date for comparison
    const normalizedSearchTerm = normalizeSearchTerm(followUpSearchTerm); // Normalize the search term
    return [
      schedule.userId,
      schedule.studentName,
      schedule.note,
      schedule.timeForConsultation,
      schedule.councelorName,
      normalizedDate,
    ]
    .join(" ")
    .toLowerCase()
    .includes(normalizedSearchTerm.toLowerCase());
  });
  
  // Utility function to normalize the date
  function normalizeDate(date: Date | string): string {
    if (!date) return ""; // Handle empty dates
    const parsedDate = new Date(date); // Parse the date
    if (isNaN(parsedDate.getTime())) return ""; // Check for invalid dates
    const month = parsedDate.getMonth() + 1; // Months are 0-based
    const day = parsedDate.getDate();
    const year = parsedDate.getFullYear();
    return `${month}/${day}/${year}`; // Use single digits for month/day
  }
  
  // Utility function to normalize the search term
  function normalizeSearchTerm(term: string): string {
  return term.replace(/(^|\/)0+/g, "$1"); // Remove leading zeros from search term
  }
  
  const pendingRequests = filteredPendingUsers.filter((request) => request.status === "pending" || request.status === "cancelled");
  const acceptedRequests = filteredAcceptedUsers.filter((request) => request.status === "accepted" || request.status === "completed");
 
  useEffect(() => {
    const fullName = localStorage.getItem("fullName");
    if (fullName) {
      setFullName(fullName);
    }
  }, []);
  
  // Accept a consultation request
  const acceptRequest = async (id: string, userEmail: string, date: string, timeForConsultation: string) => {
    try {
      const localFullName = fullName || "pending"; // Fallback if fullName is not set
      await axios.put(`${API_URL}${id}/accept`, { fullName: localFullName });
      setConsultationRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === id ? { ...request, status: "accepted", councelorName: localFullName } : request
        )
      );
      sendEmailNotification("Accepted", userEmail, date, timeForConsultation); // Pass the email
      alert("Consultation request accepted successfully.");
    } catch (error) {
      console.error("Error accepting consultation request:", error);
    }
  };
  
  

  // Decline a consultation request
  const declineRequest = async (userEmail: string, date: string, timeForConsultation: string) => {
    try {
      await axios.put(`${API_URL}${decliningRequestId}/decline`, {
        note: declineNote,
      });
      setConsultationRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === decliningRequestId
            ? { ...request, status: "declined", councelorName: "N/A", note: declineNote }
            : request
        )
      );
      setShowDeclineModal(false); // Close modal
      setDeclineNote(""); // Reset the decline note
      sendEmailNotification(`Declined - Note: ${declineNote}`, userEmail, date, timeForConsultation); // Pass the email
      alert("Consultation request declined successfully.");
    } catch (error) {
      console.error("Error declining consultation request:", error);
      alert("Failed to decline consultation request.");
    }
  };

  // Function to format date into words
const formatDateToWords = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
  

 // Function to send email
const sendEmailNotification = (status: string, userEmail: string, date: string, timeForConsultation: string) => {
  const formattedDate = formatDateToWords(date); // Format the date
  
  const templateParams = {
    to_email: userEmail,  // Use the passed email
    message: `Your consultation request has been ${status}. Scheduled on ${formattedDate} at ${timeForConsultation}.`,
  };

  emailjs
    .send("service_yihvv1g", "template_ai6rx6l", templateParams, "ltmtvf6COYbhv6bkq")
    .then((response) => {
      console.log("Email sent successfully:", response);
    })
    .catch((error) => {
      console.error("Error sending email:", error);
    });
};
  
  
const deleteConsultation = async (_id: string) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this consultation?");
  if (!confirmDelete) return;

  try {
    await axios.delete(`${API_URL}/id/${_id}/delete`);
    setConsultationRequests((prevRequests) =>
      prevRequests.map((request) =>  
        request._id === _id
    ? { ...request } : request
      )
          
    );
    alert("Consultation deleted successfully.");

    window.location.reload();
  } catch (error) {
    console.error("Error deleting consultation:", error);
    alert("Failed to delete consultation.");
  }
};

// const handleMarkAsDone = async (id: string) => {
//   try {
//     await axios.put(`${API_URL}${id}/mark-done`);
//     setConsultationRequests((prevRequests) =>
//       prevRequests.map((request) =>
//         request._id === id ? { ...request, status: "completed" } : request
//       )
//     );
//   } catch (error) {
//     console.error("Error accepting consultation request:", error);
//   }
// };

const handleCompleted = async (testID: string) => {
  const confirmCompleted = window.confirm("Are you sure you want to complete this test?");
  if (!confirmCompleted) return;
  
  try {
    // Make an API call to archive the consultation
    await axios.put(`${API_URL}archive/${testID}`);
    setConsultationRequests((prevConsultations) =>
      prevConsultations.map((consultation) =>
        consultation.testID === testID
          ? { ...consultation, status: "archived" }
          : consultation
      )
    );
    alert("This test is now completed.");
  } catch (error) {
    console.error("Error concluding consultation:", error);
    alert("Failed to conlude consultation.");
  }
};

  const factorOrder = ['A', 'B', 'C', 'E', 'F', 'G', 'H', 'I', 'L', 'M', 'N', 'O', 'Q1', 'Q2', 'Q3', 'Q4'];

  const getFactorDescription = (factorLetter: string) => {
    switch (factorLetter) {
        case 'A': return { leftMeaning: 'Reserved, Impersonal, Distant', rightMeaning: 'Warm, Outgoing, Attentive to Others',};
        case 'B': return { leftMeaning: 'Concrete', rightMeaning: 'Abstract', };
        case 'C': return { leftMeaning: 'Reactive, Emotionally Changeable', rightMeaning: 'Emotionally Stable, Adaptive, Mature' };
        case 'E': return { leftMeaning: 'Deferential, Cooperative, Avoids Conflict', rightMeaning: 'Dominant, Forceful, Assertive' };
        case 'F': return { leftMeaning: 'Serious, Restrained, Careful', rightMeaning: 'Lively, Animated, Spontaneous' };
        case 'G': return { leftMeaning: 'Expedient, Nonconforming', rightMeaning: 'Rule-conscious, Dutiful' };
        case 'H': return { leftMeaning: 'Shy, Threat-Sensitive, Timid', rightMeaning: 'Socially Bold, Venturesome, Thick Skinned' };
        case 'I': return { leftMeaning: 'Utilitarian, Objective, Unsentimental', rightMeaning: 'Sensitive, Aesthetic, Sentimental' };
        case 'L': return { leftMeaning: 'Trusting, Unsuspecting, Accepting', rightMeaning: 'Vigilant, Suspicious, Skeptical, Wary' };
        case 'M': return { leftMeaning: 'Grounded, Practical, Solution-Oriented', rightMeaning: 'Abstracted, Imaginative, Idea-Oriented' };
        case 'N': return { leftMeaning: 'Forthright, Genuine, Artless', rightMeaning: 'Private, Discreet, Non-Disclosing' };
        case 'O': return { leftMeaning: 'Self-Assured, Unworried, Complacent', rightMeaning: 'Apprehensive, Self-Doubting, Worried' };
        case 'Q1': return { leftMeaning: 'Traditional, Attached to Familiar', rightMeaning: 'Open to Change, Experimenting' };
        case 'Q2': return { leftMeaning: 'Group-Oriented, Affiliative', rightMeaning: 'Self-reliant, Solitary, Individualistic' };
        case 'Q3': return { leftMeaning: 'Tolerates Disorder, Unexacting, Flexible', rightMeaning: 'Perfectionistic, Organized, Self-Disciplined' };
        case 'Q4': return { leftMeaning: 'Relaxed, Placid, Patient', rightMeaning: 'Tense, High Energy, Impatient, Driven' };
        default: return { leftMeaning: '', rightMeaning: '' };
    }
};

// Function to determine interpretation based on stenScore
const getStenScoreMeaning = (stenScore: number, factorLetter: string) => {
  const factorDescription = getFactorDescription(factorLetter);
  if (stenScore >= 1 && stenScore <= 3) {
      return factorDescription.leftMeaning;
  } else if (stenScore >= 4 && stenScore <= 7) {
      return " ( " + 'Average' + " ) " + factorDescription.leftMeaning + " " + factorDescription.rightMeaning;
  } else if (stenScore >= 8 && stenScore <= 10) {
      return factorDescription.rightMeaning;
  }
  return 'Invalid Sten Score';
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
    <div>
    <div className={styles.statusBoxContainer}>
    <div className={styles.pendingBox}>
        <h3>Pending Requests</h3>
        <p>{pendingRequests.length}</p>
      </div>
      <div className={styles.acceptedBox}>
        <h3>Accepted Requests</h3>
        <p>{acceptedRequests.length}</p>
      </div>
      
    </div>

      {/* Pending Requests Table */}
      <div className={styles.tableBox}>
  <h2 className={styles.title}>
    Pending Consultation Request
    <button onClick={toggleModal} className={styles.viewButton}>
      View Follow-Up Schedule List
    </button>
    <div className={styles.smartWrapper}>
      <input
        type="text"
        placeholder="Search by User ID, Name, Date, Time, Note"
        value={pendingSearchTerm}
        onChange={(e) => setPendingSearchTerm(e.target.value)}
        className={styles.searchInput}
      />
    </div>
  </h2>
  {showArchived && <CompleteInbox onClose={() => setShowArchived(false)} />}
      <div className={styles.responsesWrapper}>
        {pendingRequests.length === 0 ? (
          <p className={styles.noRequestsMessage}>No pending consultation requests.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Appointment Count</th>
                <th>User ID</th>
                <th>Student Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Consultation Type</th>
                <th>Note</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests
                .slice()
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((request) => (
                  <tr key={request._id}>
                    <td>
                      {request.allAppointmentsCount} 
                      <br/>
                      <button onClick={() => toggleCounselorInfo(request.userId)} className={styles.infoButton}>
                        view appointed with counselor
                      </button>
                      {selectedUserId === request.userId && (
                        <div className={styles.counselorInfo}>
                          {Object.entries(request.counselorCounts).map(([counselor, count]) => (
                            <div key={counselor}>
                              {counselor}: {count} 
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td>{request.userId}</td>
                    <td>{request.studentName}</td>
                    <td>
                      {new Date(request.date).toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td>{request.timeForConsultation}</td>
                    <td>{request.consultationType}</td>
                    <td>{request.note}</td>
                    <td>
                      <span className={`${styles.statusButton}`}>
                        {request.status}
                      </span>
                    </td>
                    <td>
                      {request.status === "cancelled" ? (
                        <button
                          className={styles.delete}
                          onClick={() => deleteConsultation(request._id)}
                        >
                          Delete
                        </button>
                      ) : (
                        <>
                          <button
                            className={styles.accept}
                            onClick={() => acceptRequest(request._id, request.email, request.date, request.timeForConsultation)}
                          >
                            Accept
                          </button>
                          <button
                            className={styles.decline}
                            onClick={() => {
                              setDecliningRequestId(request._id);
                              setShowDeclineModal(true);
                              setEmail(request.email);
                              setDate(request.date);
                              setTimeForConsultation(request.timeForConsultation);
                            }}
                          >
                            Decline
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>




{/* Accepted Requests Table */}
<div className={styles.tableBox}>
  <h2 className={styles.title}>Accepted Consultation Request
  <button className={styles.archiveButton} onClick={openArchivedList}>
  Completed List
</button>

      <div className={styles.smartWrapper}>
            <input
              type="text"
              placeholder="Search by User ID, Name, Date, Time, Note"
              value={acceptedSearchTerm}
              onChange={(e) => setAcceptedSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
      </div>
  </h2>
  <div className={styles.responsesWrapper}>
  {acceptedRequests.length === 0 ? (
      <p className={styles.noRequestsMessage}>No accepted consultation requests yet.</p> // Message displayed when no requests
    ) : (
  <table>
    <thead>
      <tr>
        <th>Appointment Count</th>
        <th>User ID</th>
        <th>Student Name</th>
        <th>Date</th>
        <th>Time</th>
        <th>Note</th>
        <th>Councelor Name</th>
        <th>Consultation Type</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
    {acceptedRequests
        .slice() 
        .sort((a, b) => {
          if (a.status === "accepted" && b.status !== "accepted") return -1;
          if (a.status !== "accepted" && b.status === "accepted") return 1;
          if (a.status === "completed" && b.status !== "completed") return 1;
          if (a.status !== "completed" && b.status === "completed") return -1;
          return 0; 
        })
        .map((request) => (
        <tr key={request._id}>
          <td>{request.acceptedAppointmentCount}</td> 
          <td>{request.userId}</td>
          <td>{request.studentName}</td>
          <td>
            {new Date(request.date).toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
            })}
          </td>
          <td>{request.timeForConsultation}</td>
          <td>{request.note}</td>
          <td>{request.councelorName}</td>
          <td>
            {request.consultationType !== "Online" && request.consultationType}
            {request.consultationType === "Online" && (
              <button
              className={`${styles.viewButton} ${
                request.status !== "accepted" || request.councelorName !== fullName
                  ? styles.disabledButton
                  : ""
              }`}
              onClick={() => {
                if (request.status !== "accepted") {
                  alert("This consultation is already completed.");
                } else if (request.councelorName !== fullName) {
                  alert("You are not the assigned counselor for this consultation.");
                } else {
                  window.location.href = `/online-consult/${request.testID}`;
                }
              }}
            >
              View Online Consultation
            </button>
            )}
          </td>
           <td>
            <span className={`${styles.statusButton} ${styles.acceptedStatus}`}>
              {request.status}
            </span>
          </td>
          <td>
            <button
              className={styles.viewInfo}
              onClick={() => handleViewInfo(request.testID, request.note)}
            >
              View Info
            </button>

            {/* navigate to Calendar */}
            <button
              className={styles.viewInfo}
              onClick={() => {
                navigate(`/calendar`);
              }}
            >
              Follow Up
            </button>
            

            {/* Mark as Done Button (only shows when status is not "Completed") */}
            {request.status !== 'completed' && (
              <button
                className={styles.markDone}
                onClick={() => handleCompleted(request.testID)}
              >
                Mark as Done
              </button>
            )}

            {/* Archive Button (only shows when status is "Completed") */}
            {request.status === 'completed' && (
              <button
                className={styles.archive}
                onClick={() => handleCompleted(request.testID)}
              >
                Mark as Done
              </button>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  )}
  </div>
</div>

{/* today schedule */}
<div className={styles.tableBox}>
  <h3>Today's Scheduled Requests</h3>
  {acceptedRequests.filter((request) => {
    const today = new Date();
    const requestDate = new Date(request.date);
    return (
      requestDate.toDateString() === today.toDateString() &&
      request.status === "accepted"
    );
  }).length === 0 ? (
    <div className={styles.noScheduleWrapper}>
    <p className={styles.noScheduleMessage}>No scheduled requests for today.</p>
  </div>
  ) : (
    <div className={styles.responsesWrapper}>
    <table>
      <thead>
        <tr>
          <th>Appointment Count</th>
          <th>User ID</th>
          <th>Student Name</th>
          <th>Date</th>
          <th>Time</th>
          <th>Note</th>
          <th>Counselor Name</th>
          <th>Consultation Type</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
        <tbody>
          {acceptedRequests
            .filter((request) => {
              const today = new Date();
              const requestDate = new Date(request.date);
              return (
                requestDate.toDateString() === today.toDateString()

              );
            })
            .sort((a, b) => {
              if (a.status === "accepted" && b.status !== "accepted") return -1;
              if (a.status !== "accepted" && b.status === "accepted") return 1;
              if (a.status === "completed" && b.status !== "completed") return 1;
              if (a.status !== "completed" && b.status === "completed") return -1;
              return 0; 
            })
            .map((request) => (
              <tr key={request._id}>
                <td>{request.acceptedAppointmentCount}</td>
                <td>{request.userId}</td>
                <td>{request.studentName}</td>
                <td>
                  {new Date(request.date).toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </td>
                <td>{request.timeForConsultation}</td>
                <td>{request.note}</td>
                <td>{request.councelorName}</td>
                <td>
            {request.consultationType !== "Online" && request.consultationType}
            {request.consultationType === "Online" && (
              <button
              className={`${styles.viewButton} ${
                request.status !== "accepted" || request.councelorName !== fullName
                  ? styles.disabledButton
                  : ""
              }`}
              onClick={() => {
                if (request.status !== "accepted") {
                  alert("This consultation is already completed.");
                } else if (request.councelorName !== fullName) {
                  alert("You are not the assigned counselor for this consultation.");
                } else {
                  window.location.href = `/online-consult/${request.testID}`;
                }
              }}
            >
              View Online Consultation
            </button>
            
            )}
          </td>                <td>
                  <span
                    className={`${styles.statusButton} ${styles.acceptedStatus}`}
                  >
                    {request.status}
                  </span>
                </td>
                <td>
                  <button
                    className={styles.viewInfo}
                    onClick={() => handleViewInfo(request.testID, request.note)}
                  >
                    View Info
                  </button>

                   {/* navigate to Calendar */}
                  <button
                    className={styles.viewInfo}
                    onClick={() => {
                      navigate(`/calendar`);
                    }}
                  >
                    Follow Up
                  </button>

                  {request.status !== "completed" && (
                    <button
                      className={styles.markDone}
                      onClick={() => handleCompleted(request.testID)}
                    >
                      Mark as Done
                    </button>
                  )}
                  {request.status === 'completed' && (
              <button
                className={styles.archive}
                onClick={() => handleCompleted(request.testID)}
              >
                Mark as Done
              </button>
            )}
                </td>
              </tr>
            ))}
        </tbody>
    </table>
    </div>

  )}
</div>



    {showDeclineModal && (
      <div className={`${styles.declineModal} ${styles.show}`}>
        <div className={styles.declineModalContent}>
          <h3>Decline Consultation Request</h3>
          <textarea
            value={declineNote}
            onChange={(e) => setDeclineNote(e.target.value)}
            placeholder="Enter the reason for declining"
          />
          <div>
            <button onClick={() => setShowDeclineModal(false)}>Cancel</button>
            <button onClick={() => declineRequest(email, date, timeForConsultation)}>Submit</button>
          </div>
        </div>
      </div>
    )}

{showTestInfo && (
  <div className={`${styles.testInfoModal} ${styles.show}`}>
    <div className={styles.testInfoModalContent}>
      <h3 className={styles.testInfoName}>Test Information</h3>
      <table className={styles.testInfoTable}>
        <thead>
          <tr>
            <th>Field</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
  {testDetails?.data?.map((testDetails: any) => (

    
    <React.Fragment key={testDetails._id}>
     <tr>
  <td>Student Name</td>
  <td>{testDetails.studentName || testDetails.firstName + " " + testDetails.lastName}</td>
</tr>

      <tr>
        <td>Age</td>
        <td>{testDetails.age}</td>
      </tr>
      <tr>
        <td>Sex</td>
        <td>{testDetails.sex}</td>
      </tr>
      <tr>
        <td>Course</td>
        <td>{testDetails.course}</td>
      </tr>
      <tr>
        <td>Year</td>
        <td>{testDetails.year}</td>
      </tr>
      <tr>
        <td>Section</td>
        <td>{testDetails.section}</td>
      </tr>
      {testDetails.reasonForConsultation && (
        <tr>
        <td>Reason for Consultation</td>
        <td>{testDetails.reasonForConsultation}</td>
      </tr>
      )}
      
      {testDetails.note !== 'Others' && (
        <>
         
              <tr>
                <td>Test ID</td>
                <td>{testDetails.testID}</td>
              </tr>
              <tr>
                <td>Test Type</td>
                <td>{testDetails.testType}</td>
              </tr>
              <tr>
                <td>Test Date</td>
                <td>{new Date(testDetails.testDate).toLocaleString()}</td>
              </tr>
              {/* Display Total Score only if it exists */}
              {testDetails.totalScore && (
                <tr>
                  <td>Total Score</td>
                  <td>{testDetails.totalScore}</td>
                </tr>
                
              )}
              

              {testDetails.scoring && (
                <React.Fragment>
                  <tr>
                    <td className="scoring-label">Scoring</td>
                    <td>
                      <table className="scoring-table">
                        <thead>
                          <tr>
                            <th>Factor Letter</th>
                            <th>Raw Score</th>
                            <th>Sten Score</th>
                          </tr>
                        </thead>
                        <tbody>
                        {testDetails.scoring.scores
              // Filter to include only factorLetters in factorOrder
              .filter((score: any) => factorOrder.includes(score.factorLetter))
              // Sort scores based on factorOrder
              .sort((a: any, b: any) => {
                const indexA = factorOrder.indexOf(a.factorLetter);
                const indexB = factorOrder.indexOf(b.factorLetter);
                return indexA - indexB;
              })
              .map((score: any, index: number) => (
                            <tr key={index}>
                              <td>{score.factorLetter}</td>
                              <td>{score.rawScore}</td>
                              <td>{score.stenScore}</td>
                            </tr>
                            
                          ))}
                          
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  
                </React.Fragment>
              )}

              <tr>
                <td>Interpretation</td>
                
                {testDetails.interpretation?.resultInterpretation ? (
                    <td>
                    {testDetails.interpretation.resultInterpretation}
                  </td>
                ) : (
                  <td>
         <table className="scoring-table">
   
                <th>Factors</th>
                <th>Result Interpretation</th>

                {testDetails.scoring.scores
              // Filter to include only factorLetters in factorOrder
              .filter((score: any) => factorOrder.includes(score.factorLetter))
              // Sort scores based on factorOrder
              .sort((a: any, b: any) => {
                const indexA = factorOrder.indexOf(a.factorLetter);
                const indexB = factorOrder.indexOf(b.factorLetter);
                return indexA - indexB;
              })
              .map((score: any, index: number) => (
                            <tr key={index}>
                              <td>{factorDescriptions[score.factorLetter]}</td>
                              <td>{getStenScoreMeaning(score.stenScore, score.factorLetter)}</td>

                            </tr>
                          ))}
                </table>

                </td>
                )}

              </tr>
              </>
      )}

             
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <button className={styles.closeInfo} onClick={() => setShowTestInfo(false)}>Close</button>
    </div>
  </div>
)}

{isModalOpen && (
        <div className={styles.followUpModal}>
          <div className={styles.followUpModalContent}>
{/* Follow Up Requests Table */}
<div className={styles.tableBox}>
  <h2 className={styles.title}>
    Follow-Up Consultation Request
    <p>Total Follow-up Requests: {followUpSchedules.length}</p>
    <div className={styles.smartWrapper}>
      <input
        type="text"
        placeholder="Search by User ID, Name, Date, Time, Note"
        value={followUpSearchTerm}
        onChange={(e) => setFollowUpSearchTerm(e.target.value)}
        className={styles.searchInput}
      />
    </div>
  </h2>
  <div className={styles.responsesWrapper}>
    <table>
      <thead>
        <tr>
          <th>User ID</th>
          <th>Student Name</th>
          <th>Date</th>
          <th>Time</th>
          <th>Note</th>
          <th>Status</th>
          <th>Counselor Name</th>
          <th>Action</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        {filteredFollowUpUsers.length > 0 ? (
          filteredFollowUpUsers
            .map((schedule) => (
              <tr key={schedule._id}>
                <td>{schedule.userId}</td>
                <td>{schedule.studentName}</td>
                <td>{new Date(schedule.followUpDate).toLocaleDateString()}</td>
                <td>{schedule.timeForConsultation}</td>
                <td>{schedule.note}</td>
                <td>{schedule.status}</td>
                <td>{schedule.councelorName}</td>
                <td>
                  <button
                    onClick={() => handleRemove(schedule._id)}
                    className={styles.removeButton}
                  >
                    Remove
                  </button>
                </td>
                <td>{schedule.message}</td>
              </tr>
            ))
        ) : (
          <tr>
            <td colSpan={9} className={styles.noData}>
              No pending follow-up consultation requests.
            </td>
          </tr>
        )}
      </tbody>
    </table>
          </div>
        </div>
        <button onClick={toggleModal} className={styles.closeInfo}>
              Close
            </button>
      </div>
    </div>
  )}

    </div>
  );
};

export default GuidanceConsultation;


 {/* Show responses with isCorrect
              {test.responses && (
                <tr>
                  <td>Responses</td>
                  <td>
                    <ul>
                      {test.responses.map((response: any, index: number) => (
                        <li key={index}>
                          {response.questionID ? `Question ${response.questionID}: ` : ''} 
                          {response.selectedChoice ? (
                            response.selectedChoice.includes('http') ? (
                              <img src={response.selectedChoice} alt={`Question ${response.questionID}`} className={styles.responseImage} />
                            ) : (
                              `Selected: ${response.selectedChoice}`
                            )
                          ) : 'No choice selected'}
                          {response.equivalentScore ? `, Score: ${response.equivalentScore}` : ''}
                          {response.factorLetter ? `, Factor: ${response.factorLetter}` : ''}

                          {/* Display if the answer is correct or not */}
                          {/* {response.isCorrect !== undefined && (
                            <span>{response.isCorrect ? 'Correct' : 'Incorrect'}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr> */}
              {/* )} */} 