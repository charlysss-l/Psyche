import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ArchiveInbox.module.scss";

interface Consultation {
  userId: string;
  date: string;
  testID: string;
  timeForConsultation: string;
  note: string;
  status: string;
  message: string;
}

const API_URL = "http://localhost:5000/api/consult/";

const ArchiveInbox = () => {
  const [archivedConsultations, setArchivedConsultations] = useState<Consultation[]>([]);
  const [userId, setUserID] = useState("");
  const [isVisible, setIsVisible] = useState(true); // State to control visibility

  
  const fetchConsultations = async () => {
    try {
      // Send a request to fetch consultations where status = 'archived'
      const response = await axios.get(`${API_URL}archive/status/archived`);
      if (response?.data?.data) {
        setArchivedConsultations(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching consultations:", error);
    }
  };
  
  useEffect(() => {
    fetchConsultations(); // Fetch all archived consultations on mount
  }, []);
  

  const handleClose = () => {
    setIsVisible(false); // Hide the component when the close button is clicked
  };

  if (!isVisible) return null; // If isVisible is false, render nothing

  const restoreConsultation = async (testID: string) => {
    try {
      // Make an API call to archive the consultation
      await axios.put(`${API_URL}restore/${testID}`);
      setArchivedConsultations((prevConsultations) =>
        prevConsultations.map((consultation) =>
          consultation.testID === testID
            ? { ...consultation, status: "completed" }
            : consultation
        )
      );
      alert(" restored successfully.");
    } catch (error) {
      console.error("Error restoring consultation:", error);
      alert("Failed to restore consultation.");
    }
  };

  return (
    <div className={styles.tableContainer}>
      <h2>Archived Consultation Records</h2>
      <button className={styles.closeButton} onClick={handleClose}>Close</button> {/* Close button */}


      <div className={styles.responsesWrapper}>
        <table className={styles.table}>
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
                  <td><button
                      className={`${styles.actionButton} ${styles.restore}`}
                      onClick={() => restoreConsultation(consultation.testID)}
                    >
                      Restore
                    </button></td>
                  
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
  );
};

export default ArchiveInbox;
