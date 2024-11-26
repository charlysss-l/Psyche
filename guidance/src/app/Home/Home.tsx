import React, { useEffect, useState } from "react";
import { fetchConsultationRequests } from "../services/consultationservice";
import styles from "./Home.scss";

const GuidanceHome: React.FC = () => {
  const [consultationRequests, setConsultationRequests] = useState<any[]>([]);
  const [todayConsultations, setTodayConsultations] = useState<any[]>([]);

  useEffect(() => {
    const loadConsultationRequests = async () => {
      try {
        const requests = await fetchConsultationRequests();
        setConsultationRequests(requests);

        // Get today's date to filter consultations
        const today = new Date().toLocaleDateString();

        // Filter for accepted consultations that match today's date
        const todaysConsultations = requests.filter((request:any) => {
          const requestDate = new Date(request.date).toLocaleDateString();
          return request.status === "accepted" && requestDate === today;
        });

        setTodayConsultations(todaysConsultations);
      } catch (error) {
        console.error("Error loading consultation requests:", error);
      }
    };

    loadConsultationRequests();
  }, []);

  const newConsultations = consultationRequests.filter(
    (request) => request.status === "pending"
  );

  return (
    <div className={styles.homeContainer}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <h2 className={styles.welcomeTitle}>WELCOME TO DISCOVERU</h2>
        <p className={styles.welcomeMessage}>
          Get updated on student's consultation request and track your schedule here now in your calendar
        </p>
      </div>

      {/* New Consultation Request Section */}
      <div className={styles.newConsultationSection}>
        <h1>New Consultation Request</h1>
        <p>{newConsultations.length} pending consultation request(s)</p>

        {/* Table for New Consultation Requests */}
        <div className={styles.tableBox}>
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Time</th>
                <th>Note</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {newConsultations.map((request) => (
                <tr key={request._id}>
                  <td>{request.userId}</td>
                  <td>{request.timeForConsultation}</td>
                  <td>{request.note}</td>
                  <td>
                    <span
                      className={`${styles.statusButton} ${
                        request.status === "accepted" ? styles.acceptedStatus : ""
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
     {/* Below the table, add the link button */}
     <div className={styles.viewConsultationContainer}>
          <button
            className={styles.viewConsultationButton}
            onClick={() => window.location.href = '/consultation'}>
            View Consultation Table
          </button>
        </div>
        {/* Consultation Schedule for Today */}
        <div className={styles.tableBox}>
          <h2>Guidance's Consultation Schedule for Today</h2>
          {todayConsultations.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Time</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {todayConsultations.map((consultation) => (
                  <tr key={consultation._id}>
                    <td>{consultation.userId}</td>
                    <td>{consultation.timeForConsultation}</td>
                    <td>{consultation.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No consultation for today.</p>
          )}
        </div>

   
      </div>
    </div>
  );
};

export default GuidanceHome;
