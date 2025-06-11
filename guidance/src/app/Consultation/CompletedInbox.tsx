import { useState, useEffect } from "react";
import axios from "axios";
import backendUrl from "../../config";
import styles from "./CompletedInbox.module.scss";

interface Consultation {
  userId: string;
  date: string;
  studentName: string;
  councelorName: string;
  testID: string;
  timeForConsultation: string;
  note: string;
  message: string;
  acceptedAppointmentCount: number; // Add this field

}

const API_URL = `${backendUrl}/api/consult/`;

const CompleteInbox = ({ onClose }: { onClose: () => void }) => {
  const [completedConsultations, setCompletedConsultations] = useState<Consultation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isHighlighted, setIsHighlighted] = useState(false);

  const [currentCompletedPage, setCurrentCompletedPage] = useState(1);
  const completedRequestsPerPage = 6;

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const response = await axios.get(`${API_URL}archive/status/archived`);
      if (response?.data?.data) {
        setCompletedConsultations(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching consultations:", error);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose(); // Notify parent to hide it
  };

  if (!isVisible) return null;

 // handleDelete
 const handleDeleteClick = async (testID: string) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this consultation?");
  if (!confirmDelete) return;

  try {
    await axios.delete(`${API_URL}/test/${testID}/delete`);
    setCompletedConsultations((prevConsultations) =>
      prevConsultations.filter((consultation) => consultation.testID !== testID)
    );
    alert("Deleted successfully.");
  } catch (error) {
    console.error("Error deleting consultation:", error);
    alert("Failed to delete consultation.");
  }
 }

  const restoreConsultation = async (testID: string) => {
    try {
      await axios.put(`${API_URL}restore/${testID}`);
      setCompletedConsultations((prevConsultations) =>
        prevConsultations.filter((consultation) => consultation.testID !== testID)
      );
      alert("Restored successfully.");
    } catch (error) {
      console.error("Error restoring consultation:", error);
      alert("Failed to restore consultation.");
    }
  };

  // Smart Search Filtering
  const filteredConsultations = completedConsultations.filter((consultation) => {
    const query = searchQuery.toLowerCase();
    
    // Format the consultation date properly
    const formattedDate = new Date(consultation.date).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  
    return (
      consultation.userId.toLowerCase().includes(query) ||
      consultation.studentName.toLowerCase().includes(query) ||
      consultation.councelorName.toLowerCase().includes(query) ||
      consultation.timeForConsultation.toLowerCase().includes(query) ||
      formattedDate.includes(query) || // Check against formatted date
      consultation.testID.toLowerCase().includes(query) ||
      consultation.note.toLowerCase().includes(query)
    );
  });

   // Pagination Completed calculations
const totalCompletedPages = Math.ceil(filteredConsultations.length / completedRequestsPerPage);
const paginatedCompletedRequests = filteredConsultations.slice(
  (currentCompletedPage - 1) * completedRequestsPerPage,
  currentCompletedPage * completedRequestsPerPage
);
  

  if (!isVisible) return null;

  return (
    <div
      className={`${styles.overlay} ${isHighlighted ? styles.darkOverlay : ""}`}
      onClick={() => setIsHighlighted(false)}
    >
      <div className={styles.tableContainer}>
        <h2>Completed Consultation Records</h2>
        <button className={styles.closeButton} onClick={handleClose}>Close</button>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by User ID, Student Name, Councelor Name, Date, etc..."
            className={styles.searchBar}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.responsesWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Appointment Count</th>
                <th>User ID</th>
                <th>Student Name</th>
                <th>Councelor Name</th>
                <th>Date</th>
                <th>Time for Consultation</th>
                <th>Note</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCompletedRequests.length > 0 ? (
                paginatedCompletedRequests.map((consultation) => (
                  <tr key={consultation.testID}>
                    <td>{consultation.acceptedAppointmentCount}</td>
                    <td>{consultation.userId}</td>
                    <td>{consultation.studentName}</td>
                    <td>{consultation.councelorName}</td>
                    <td>
                      {new Date(consultation.date).toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td>{consultation.timeForConsultation}</td>
                    <td>{consultation.note}</td>
                    <td>
                      <button
                        className={`${styles.actionButton} ${styles.restore}`}
                        onClick={() => restoreConsultation(consultation.testID)}
                      >
                        Restore
                      </button>
                       
                       {/* delete button */}
                       <button
                        className={`${styles.actionButton} ${styles.delete}`}
                        onClick={() => handleDeleteClick( consultation.testID)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8}>No completed consultations found</td>
                </tr>
              )}
            </tbody>
          </table>

             {totalCompletedPages > 1 && (
  <div className={styles.pagination}>
    <button
      onClick={() => setCurrentCompletedPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentCompletedPage === 1}
      className={styles.pageButton}
    >
      Previous
    </button>
    <span className={styles.pageInfo}>
      Page {currentCompletedPage} of {totalCompletedPages}
    </span>
    <button
      onClick={() =>
        setCurrentCompletedPage((prev) => Math.min(prev + 1, totalCompletedPages))
      }
      disabled={currentCompletedPage === totalCompletedPages}
      className={styles.pageButton}
    >
      Next
    </button>
  </div>
)}
        </div>
      </div>
    </div>
  );
};

export default CompleteInbox;
