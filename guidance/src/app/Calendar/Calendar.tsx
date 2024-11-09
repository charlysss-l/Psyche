import React, { useEffect, useState } from "react";
import Calendar from "react-calendar"; // Assuming you installed react-calendar
import { fetchConsultationRequests } from "../services/consultationservice";
import axios from "axios";
import styles from "./Calendar.scss";

interface ConsultationRequest {
  _id: string;
  userId: string;
  timeForConsultation: string;
  note: string;
  permissionForTestResults: boolean;
  date: string;
  status: string;
}

const SchedulingCalendar: React.FC = () => {
  const [consultationRequests, setConsultationRequests] = useState<ConsultationRequest[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

  const filteredRequests = consultationRequests.filter(
    (request) => new Date(request.date).toDateString() === selectedDate?.toDateString()
  );

  return (
    <div className={styles.calendarContainer}>
      <Calendar onClickDay={handleDateClick} />
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
        </div>
      )}
    </div>
  );
};

export default SchedulingCalendar;
