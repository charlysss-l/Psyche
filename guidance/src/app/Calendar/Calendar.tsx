import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import Modal from "react-modal";
import { fetchConsultationRequests } from "../services/consultationservice";
import axios from "axios";
import styles from "./Calendar.scss";

const API_URL = "http://localhost:5000/api/consult/";

interface ConsultationRequest {
  _id: string;
  userId: string;
  timeForConsultation: string;
  note: string;
  date: string;
  status: string;
}

const SchedulingCalendar: React.FC = () => {
  const [consultationRequests, setConsultationRequests] = useState<ConsultationRequest[]>([]);
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
      const response = await axios.post("http://localhost:5000/api/consultationRequests", {
        userId,
        timeForConsultation,
        note,
        date: selectedDate?.toDateString(),
        status: "accepted",
      });
      if (response.status === 201) {
        setErrorMessage("");
        const newRequest = response.data as ConsultationRequest;
        setConsultationRequests([...consultationRequests, newRequest]);
      }
    } catch (error) {
      console.error("Error adding consultation request:", error);
      setErrorMessage("Error adding consultation request. Please try again.");
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
      (request) => new Date(request.date).toDateString() === date.toDateString() && request.status === "accepted"
    );
  };

  const filteredRequests = consultationRequests.filter(
    (request) => new Date(request.date).toDateString() === selectedDate?.toDateString() && request.status === "accepted"
  );

  return (
    <div className={styles.calendarContainer}>
      <Calendar
        onClickDay={handleDateClick}
        tileClassName={({ date }) => {
          return isScheduledDate(date) ? styles.scheduledDate : "";
        }}
        tileContent={({ date, view }) => {
          if (view === "month") {
            const count = consultationRequests.filter(
              (request) => new Date(request.date).toDateString() === date.toDateString() && request.status === "accepted"
            ).length;
            return count ? <div className="schedule-count">{count}</div> : null;
          }
          return null;
        }}
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Consultation Details"
        className={styles.modalContent}
        overlayClassName={styles.modalOverlay}
        ariaHideApp={false} // Only use false if your app doesn't use `#root` as its main element
      >
        {selectedDate && (
          <>
            <h2>Requests for {selectedDate.toDateString()}</h2>
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
              <p>No accepted requests for this date.</p>
            )}

            {/* Form to Add New Schedule */}
            <h3>Add New Schedule</h3>
            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
              <div>
                <label>User ID:</label>
                <input type="text" name="userId" required />
              </div>
              <div>
                <label>Time for Consultation:</label>
                <input type="time" name="timeForConsultation" required />
              </div>
              <div>
                <label>Note:</label>
                <textarea name="note" required />
              </div>
              <button type="submit">Add Schedule</button>
            </form>
            <button onClick={closeModal} className={styles.closeButton}>
              Close
            </button>
          </>
        )}
      </Modal>
    </div>
  );
};

export default SchedulingCalendar;
