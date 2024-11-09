import React, { useEffect, useState } from "react";
import { fetchConsultationRequests } from "../services/consultationservice";
import axios from "axios";
import styles from "./Consultation.scss";

const API_URL = "http://localhost:5000/api/consult/";

interface ConsultationRequest {
  _id: string;
  userId: string;
  timeForConsultation: string;
  note: string;
  permissionForTestResults: boolean;
  date: string;
  status: string;
}

const GuidanceConsultation: React.FC = () => {
  const [consultationRequests, setConsultationRequests] = useState<
    ConsultationRequest[]
  >([]);
  const [declineNote, setDeclineNote] = useState<string>("");
  const [showDeclineModal, setShowDeclineModal] = useState<boolean>(false);
  const [decliningRequestId, setDecliningRequestId] = useState<string>("");

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

  const pendingRequests = consultationRequests.filter(
    (request) => request.status === "pending"
  );
  const acceptedRequests = consultationRequests.filter(
    (request) => request.status === "accepted"
  );

  // Accept a consultation request
  const acceptRequest = async (id: string) => {
    try {
      await axios.put(`${API_URL}${id}/accept`);
      setConsultationRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === id ? { ...request, status: "accepted" } : request
        )
      );
    } catch (error) {
      console.error("Error accepting consultation request:", error);
    }
  };

  // Decline a consultation request
  const declineRequest = async () => {
    try {
      await axios.delete(`${API_URL}${decliningRequestId}/decline`, {
        data: { note: declineNote },
      });
      setConsultationRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== decliningRequestId)
      );
      setShowDeclineModal(false); // Close modal
      setDeclineNote(""); // Reset the decline note
    } catch (error) {
      console.error("Error declining consultation request:", error);
    }
  };

  return (
    <div>
      <div className={styles.statusBoxContainer}>
        <div className={styles.acceptedBox}>
          <h3>Accepted Requests</h3>
          <p>{acceptedRequests.length}</p>
        </div>
        <div className={styles.pendingBox}>
          <h3>Pending Requests</h3>
          <p>{pendingRequests.length}</p>
        </div>
      </div>

      <div className={styles.tableBox}>
        <h2>Consultation Requests</h2>
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
            {consultationRequests.map((request) => (
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
                <td>
                  {request.status === "pending" ? (
                    <>
                      <button
                        className={styles.accept}
                        onClick={() => acceptRequest(request._id)}
                      >
                        Accept
                      </button>
                      <button
                        className={styles.decline}
                        onClick={() => {
                          setDecliningRequestId(request._id);
                          setShowDeclineModal(true);
                        }}
                      >
                        Decline
                      </button>
                    </>
                  ) : (
                    <button className={styles.viewInfo} disabled>
                      View Info
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDeclineModal && (
        <div className={styles.declineModal}>
          <div className={styles.declineModalContent}>
            <h3>Decline Consultation Request</h3>
            <textarea
              value={declineNote}
              onChange={(e) => setDeclineNote(e.target.value)}
              placeholder="Enter the reason for declining"
            />
            <div>
              <button onClick={() => setShowDeclineModal(false)}>Cancel</button>
              <button onClick={declineRequest}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuidanceConsultation;
