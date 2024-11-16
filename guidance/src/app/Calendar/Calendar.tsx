import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { fetchConsultationRequests } from "../services/consultationservice";
import axios from "axios";
import styles from "./Calendar.scss";

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
  const [newSchedule, setNewSchedule] = useState({
    userId: "",
    timeForConsultation: "",
    note: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");

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

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const acceptRequest = async (id: string) => {
    try {
      await axios.put(`http://localhost:5000/api/consult/${id}/accept`);
      setConsultationRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === id ? { ...request, status: "accepted" } : request
        )
      );
    } catch (error) {
      console.error("Error accepting consultation request:", error);
    }
  };

  const handleScheduleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSchedule((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate) {
      setErrorMessage("Please select a date for the consultation.");
      return;
    }

    if (!newSchedule.userId || !newSchedule.timeForConsultation || !newSchedule.note) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      const newRequest = {
        ...newSchedule,
        date: selectedDate?.toISOString(),
        status: "pending",
      };

      const response = await axios.post("http://localhost:5000/api/consult", newRequest);
      setConsultationRequests((prevRequests) => [...prevRequests, response.data]);
      setNewSchedule({
        userId: "",
        timeForConsultation: "",
        note: "",
      });
      setErrorMessage(""); // Clear error message on successful submit
    } catch (error) {
      console.error("Error adding new schedule:", error);
      setErrorMessage("There was an error adding the schedule. Please try again.");
    }
  };

  const filteredRequests = consultationRequests.filter(
    (request) => new Date(request.date).toDateString() === selectedDate?.toDateString()
  );

  // Function to determine if a date has schedules and should be red
  const isScheduledDate = (date: Date) => {
    return consultationRequests.some(
      (request) => new Date(request.date).toDateString() === date.toDateString()
    );
  };

  return (
    <div className={styles.calendarContainer}>
      <Calendar
        onClickDay={handleDateClick}
        tileClassName={({ date }) => {
          // Add red background for dates with schedules
          return isScheduledDate(date) ? styles.scheduledDate : "";
        }}
        tileContent={({ date, view }) => {
          if (view === "month") {
            const count = consultationRequests.filter(
              (request) => new Date(request.date).toDateString() === date.toDateString()
            ).length;
            return count ? <div className="schedule-count">{count}</div> : null;
          }
          return null;
        }}
      />
      {selectedDate && (
        <div className={styles.requestList}>
          <h2>Requests for {selectedDate.toDateString()}</h2>
          {filteredRequests.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Time</th>
                  <th>Note</th>
                  <th>Status</th>
                  <th>Action</th>
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
                      {request.status === "pending" && (
                        <button onClick={() => acceptRequest(request._id)}>
                          Accept
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No requests for this date.</p>
          )}

          <h3>Add New Schedule</h3>
          {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <label>User ID:</label>
              <input
                type="text"
                name="userId"
                value={newSchedule.userId}
                onChange={handleScheduleChange}
                required
              />
            </div>
            <div>
              <label>Time for Consultation:</label>
              <input
                type="time"
                name="timeForConsultation"
                value={newSchedule.timeForConsultation}
                onChange={handleScheduleChange}
                required
              />
            </div>
            <div>
              <label>Note:</label>
              <textarea
                name="note"
                value={newSchedule.note}
                onChange={handleScheduleChange}
                required
              />
            </div>
            <button type="submit">Add Schedule</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SchedulingCalendar;
