import React, { useEffect, useState } from "react";
import { fetchConsultationRequests } from "../services/consultationservice";
import styles from "./homepage.module.scss";
//serves as home of guidance user.
//It displays new consultation requests and today's scheduled consultations, 
//while providing a link to navigate to the calendar and consultation table.
const GuidanceHome: React.FC = () => {  // State to store all consultation requests
  const [consultationRequests, setConsultationRequests] = useState<any[]>([]);
    // State to store consultations scheduled for today
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
        <button
            className={styles.viewCalendar}
            onClick={() => window.location.href = '/calendar'}>
            View Calendar
          </button>
      </div>

      {/* New Consultation Request Section */}
      <div className={styles.newConsultationSection}>
        

        {/* Table for New Consultation Requests */}
        <div className={styles.tableBox}>
        <h1>New Consultation Request</h1>
        <p>{newConsultations.length} pending consultation request(s)</p>
        <div className={styles.responsesWrapper}>

          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Date</th>
                <th>Time</th>
                <th>Note</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {newConsultations.map((request) => (
                <tr key={request._id}>
                  <td>{request.userId}</td>
                  <td>
  {new Date(request.date).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  })}
</td>

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
      <p>to Update the status of Request view consultation table</p>
          <button
            className={styles.viewConsultationButton}
            onClick={() => window.location.href = '/consultation'}>
            View Consultation Table
          </button>
        </div>
        </div>
        {/* Consultation Schedule for Today */}
        <div className={styles.tableBox}>
          <h2>Guidance's Consultation Schedule for Today</h2>
          <p>{todayConsultations.length} pending consultation request(s)</p>
          {todayConsultations.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {todayConsultations.map((consultation) => (
                  <tr key={consultation._id}>
                    <td>{consultation.userId}</td>
                    <td>
  {new Date(consultation.date).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  })}
</td>

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
