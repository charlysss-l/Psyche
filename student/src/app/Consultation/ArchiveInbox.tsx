import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ArchiveInbox.module.scss";
import backendUrl from "../../config";

interface Consultation {
  userId: string;
  date: string;
  testID: string;
  timeForConsultation: string;
  note: string;
  status: string;
  message: string;
}

const API_URL = `${backendUrl}/api/consult/`;

const ArchiveInbox = () => {
  const [archivedConsultations, setArchivedConsultations] = useState<Consultation[]>([]);
  const [userId, setUserID] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserID(storedUserId);
      fetchConsultations(storedUserId); 
    }
  }, []); 

  const fetchConsultations = async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}archive/userId/${userId}`);
      if (response?.data?.data) {
        setArchivedConsultations(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching consultations:", error);
    }
  };

  const handleClose = () => {
    setIsVisible(false); 
  };
  const handleArchiveClick = () => {
    setIsHighlighted(true); 
  };

  if (!isVisible) return null;

  const deleteConsultation = async (testID: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this consultation?");
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`${API_URL}/test/${testID}/delete`);
      setArchivedConsultations((prevConsultations) =>
        prevConsultations.filter((consultation) => consultation.testID !== testID)
      );
      alert("Consultation deleted successfully.");
    } catch (error) {
      console.error("Error deleting consultation:", error);
      alert("Failed to delete consultation.");
    }
  };

  return (
    <div className={`${styles.overlay} ${isHighlighted ? styles.darkOverlay : ""}`} onClick={() => setIsHighlighted(false)}>
    <div className={styles.tableContainer}>
      <h2 className = {styles.archivetitle}>Archived Consultation Records</h2>
      <button className={styles.closeButton} onClick={handleClose}>Close</button>
      
      <div className={styles.responsesWrapper}>
        <table className={styles.tableArchive}>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Date</th>
              <th>Time for Consultation</th>
              <th>Test ID</th>
              <th>Note</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {archivedConsultations.length > 0 ? (
              archivedConsultations.map((consultation) => (
                <tr key={consultation.testID}>
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
                    <button
                      className={`${styles.actionButton} ${styles.delete}`}
                      onClick={() => deleteConsultation(consultation.testID)}
                    >
                      Delete
                    </button>
                    </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>No archived consultations found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
};

export default ArchiveInbox;
