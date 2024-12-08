import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import Modal from "react-modal";
import { fetchConsultationRequests } from "../services/consultationservice";
import { fetchFollowUpSchedules } from "../services/followupservice";
import axios from "axios";
import styles from "./Calendar.scss" ;
import style from "./Modal.module.scss";

const API_URL = "http://localhost:5000/api/consult/";

interface ConsultationRequest {
  _id: string;
  userId: string;
  timeForConsultation: string;
  note: string;
  date: string;
  status: string;
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

const SchedulingCalendar: React.FC = () => {
  const [consultationRequests, setConsultationRequests] = useState<ConsultationRequest[]>([]);
  const [followUpSchedules, setFollowUpSchedules] = useState<FollowUpSchedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
  }, []);

  const handleMarkAsDone = async (id: string) => {
    try {
      await axios.put(`${API_URL}${id}/mark-done`);
      setConsultationRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === id ? { ...request, status: "completed" } : request
        )
      );
    } catch (error) {
      console.error("Error accepting consultation request:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const userId = (form.elements.namedItem("userId") as HTMLInputElement).value;
    const timeForConsultation = (form.elements.namedItem("timeForConsultation") as HTMLInputElement).value;
    const note = (form.elements.namedItem("note") as HTMLInputElement).value;
  
    try {
      const response = await axios.post("http://localhost:5000/api/followup", {
        userId,
        followUpDate: selectedDate?.toDateString(),
        timeForConsultation,
        note,
      });
      if (response.status === 201) {
        setErrorMessage("");
        setConsultationRequests([...consultationRequests, response.data]);
      }
      alert("Follow Up Scheduled successfully.");

    } catch (error) {
      console.error("Error adding follow-up schedule:", error);
      setErrorMessage("Error adding follow-up schedule. Please try again.");
    }
  };
  

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const isScheduledDate = (date: Date) => {
    return consultationRequests.some(
      (request) => new Date(request.date).toDateString() === date.toDateString() && request.status === "accepted",
      followUpSchedules.some((schedule) => schedule.followUpDate === date.toDateString() && schedule.status === "accepted")
    );
  };

  const filteredRequests = consultationRequests.filter(
    (request) => new Date(request.date).toDateString() === selectedDate?.toDateString() && request.status === "accepted"
  );

  const filteredSchedules = followUpSchedules.filter(
    (schedule) => schedule.followUpDate === selectedDate?.toDateString() && schedule.status === "accepted"
  );

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
    <div className={styles.calendarContainer}>
      <Calendar
        onClickDay={handleDateClick}
        tileClassName={({ date }) => {
          return isScheduledDate(date) ? styles.scheduledDate : "";
        }}
        tileContent={({ date, view }) => {
          if (view === "month") {
            const consultationCount = consultationRequests.filter(
              (request) => new Date(request.date).toDateString() === date.toDateString() && request.status === "accepted"
            ).length;

            const followUpCount = followUpSchedules.filter(
              (schedule) => schedule.followUpDate === date.toDateString() && schedule.status === "accepted"
            ).length;
            
            return (
              <div className="schedule-count">
                {consultationCount > 0 && (
                  <div className="consult-count">{consultationCount}</div>
                )}
                {followUpCount > 0 && (
                  <div className="followup-count">{followUpCount}</div>
                )}
              </div>
            );
          }
          
          return null;
        }}
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Consultation Details"
        className={style.modalContent}
        overlayClassName={style.modalOverlay}
        ariaHideApp={false} // Only use false if your app doesn't use `#root` as its main element
      >
        
        {selectedDate && (
          <>
            <h2><span className={style.flowerConsult}>❀</span> Requests for {selectedDate.toDateString()}</h2>
            <div className={style.responsesWrapper}>

            {filteredRequests.length > 0 ? (
              
              <table>
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Time</th>
                    <th>Note</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <tr key={request._id}>
                      <td>{request.userId}</td>
                      <td>{request.timeForConsultation}</td>
                      <td>{request.note}</td>
                      <td>{request.status}</td>
                      <td>
                        <button onClick={() => handleMarkAsDone(request._id)}>Mark as Done</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
            ) : (
              <p className={styles.noAccepted}>No accepted requests for this date.</p>
            )}
            </div>

            <h2><span className={style.flowerFollowup}>❀</span> Follow Up Schedules for {selectedDate.toDateString()}</h2>
            <div className={style.responsesWrapper}>

            {filteredSchedules.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Time</th>
                    <th>Note</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedules.map((schedule) => (
                    <tr key={schedule._id}>
                      <td>{schedule.userId}</td>
                      <td>{schedule.timeForConsultation}</td>
                      <td>{schedule.note}</td>
                      <td>{schedule.status}</td>
                      <td>
                        <button onClick={() => handleRemove(schedule._id)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className={styles.noAccepted}>No accepted schedules for this date.</p>
            )}
            </div>

            {/* Form to Add New Schedule */}
            <h3 className = {styles.newschedadd}>Add Follow Up Schedule</h3>
            {errorMessage && <p className={style.errorMessage}>{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
              <div>
                <label className={styles.newSchedlabel}>User ID:</label>
                <input type="text" name="userId" className="newSchedinput" required />
              </div>
              <div>
                <label className={styles.newSchedlabel}>Time for Consultation:</label>
                <input type="time" name="timeForConsultation" className="newSchedinput" required />
              </div>
              <div>
                <label className={styles.newSchedlabel}>Note:</label>
                <textarea name="note" className="newSchedinput" required />
              </div>
              <button type="submit">Add Schedule</button>
            </form>
            <button onClick={closeModal} className={style.closeButton}>
              Close
            </button>
          </>
        )}
      </Modal>
    </div>
  );
};

export default SchedulingCalendar;
