import React, { useEffect, useState } from "react";
import { fetchConsultationRequests } from "../services/consultationservice";
import { fetchFollowUpSchedules } from "../services/followupservice";
import styles from "./homepage.module.scss";
import backendUrl from "../../config";
import { Link, useNavigate } from "react-router-dom";

//serves as home of guidance user.
//It displays new consultation requests and today's scheduled consultations, 
//while providing a link to navigate to the calendar and consultation table.
const GuidanceHome: React.FC = () => {  // State to store all consultation requests
  const [consultationRequests, setConsultationRequests] = useState<any[]>([]);
    // State to store consultations scheduled for today
  const [todayConsultations, setTodayConsultations] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [followUpSchedules, setFollowUpSchedules] = useState<any[]>([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/authGuidance/guidance`);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setUsers(data);

        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchAllUsers();
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


  const newConsultations = consultationRequests.filter(
    (request) => request.status === "pending"
  );

  const acceptedRequests = consultationRequests.filter((request) => request.status === "accepted" || request.status === "completed");


  return (
    <div className={styles.homeContainer}>
       {/* Header Section */}
       <div className={styles.headerSection}>
        <h2 className={styles.welcomeTitle}>WELCOME TO DISCOVERU</h2>
        <p className={styles.welcomeMessage}>
          Stay updated on students' consultation requests and track your schedule in your calendar.
        </p>
        <button
            className={styles.viewCalendar}
            onClick={() => window.location.href = '/calendar'}>
            View Calendar
          </button>
      </div>

      <div className={styles.mainContainer}>
  <div className={styles.scheduleContainer}>
    <div className={styles.cardRow}>
      <div className={styles.schedule}>
        <p className={styles.total}>Total Pending Request: <br/> <span className={styles.count}>{newConsultations.length}</span> <br/>
</p>
      </div>
      <div className={styles.schedule}>
        <p className={styles.total}>Total Accepted Request: <br/> <span className={styles.count}>{acceptedRequests.length}</span><br/>
</p>
      </div>
      <div className={styles.schedule}>
        <p className={styles.total}>Today Schedule: <br/> <span className={styles.count}>{todayConsultations.length}</span><br/>
</p>
      </div>
      <div className={styles.schedule}>
        <p className={styles.total}>Total Follow Up Schedule: <br/> <span className={styles.count}>{followUpSchedules.length}</span><br/>
</p>
      </div>
    </div>
  </div>

  <div className={styles.usersContainer}>
    <div className={styles.cardRow}>
      <div className={styles.users}>
        <p className={styles.total}>Total Users: <br/> <span className={styles.count}>{users.length}</span><br/>
</p>

      </div>
      
    </div>
                <button className={styles.seeUsers} onClick={() => navigate("/create-account")}>View Users Account</button>

  </div>
</div>

     

    </div>
  );
};

export default GuidanceHome;
