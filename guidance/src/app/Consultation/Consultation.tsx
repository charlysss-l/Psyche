import React, { useEffect, useState } from "react";
import { fetchConsultationRequests } from "../services/consultationservice";
import axios from "axios";
import styles from "./Consultation.scss";
import e from "express";

const API_URL = "http://localhost:5000/api/consult/";
const USERIQ_URL = "http://localhost:5000/api/useriq/test/";
const USERPF_URL = "http://localhost:5000/api/user16pf/test/";
const USERIQOMRE_URL = "http://localhost:5000/api/omr/test/";
const USERPFOMRE_URL = "http://localhost:5000/api/omr16pf/test/";

interface ConsultationRequest {
  _id: string;
  userId: string;
  timeForConsultation: string;
  note: string;
  testID: string;
  date: string;
  status: string;
}

const GuidanceConsultation: React.FC = () => {
  const [consultationRequests, setConsultationRequests] = useState<ConsultationRequest[]>([]);
  const [testDetails, setTestDetails] = useState<any>(null);  // For storing test results
  const [showTestInfo, setShowTestInfo] = useState<boolean>(false);  // To control modal visibility
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

  // Fetch test details based on testID
  const fetchTestDetails = async (testID: string, note: string) => {
    try {
      let response;
      if (note === "IQ Test (Online)") {
        response = await axios.get(`${USERIQ_URL}${testID}`);	
      } else if (note === "IQ Test (Physical)") {
        response = await axios.get(`${USERIQOMRE_URL}${testID}`);
      } else if (note === "Personality Test (Online)") {
        response = await axios.get(`${USERPF_URL}${testID}`);
      } else if (note === "Personality Test (Physical)") {
        response = await axios.get(`${USERPFOMRE_URL}${testID}`);
      } else if (note === "Others") {
        
      }

      if (response?.data) {
        setTestDetails(response.data);
        setShowTestInfo(true);  // Show modal with test details
      } else {
        console.log("No test details found.");
      }
    } catch (error) {
      console.error("Error fetching test details:", error);
    }
  };

  const handleViewInfo = (testID: string, note: string) => {
    fetchTestDetails(testID, note);
  };

  const pendingRequests = consultationRequests.filter((request) => request.status === "pending");
  const acceptedRequests = consultationRequests.filter((request) => request.status === "accepted");

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

  const getFactorDescription = (factorLetter: string) => {
    switch (factorLetter) {
        case 'A':
            return {
                leftMeaning: 'Reserved, Impersonal, Distant',
                rightMeaning: 'Warm, Outgoing, Attentive to Others',
            };
        case 'B':
            return {
                leftMeaning: 'Concrete',
                rightMeaning: 'Abstract',
            };
        case 'C':
            return {
                leftMeaning: 'Reactive, Emotionally Changeable',
                rightMeaning: 'Emotionally Stable, Adaptive, Mature',
            };
        case 'E':
            return {
                leftMeaning: 'Deferential, Cooperative, Avoids Conflict',
                rightMeaning: 'Dominant, Forceful, Assertive',
            };
        case 'F':
            return {
                leftMeaning: 'Serious, Restrained, Careful',
                rightMeaning: 'Lively, Animated, Spontaneous',
            };
        case 'G':
            return {
                leftMeaning: 'Expedient, Nonconforming',
                rightMeaning: 'Rule-conscious, Dutiful',
            };
        case 'H':
            return {
                leftMeaning: 'Shy, Threat-Sensitive, Timid',
                rightMeaning: 'Socially Bold, Venturesome, Thick Skinned',
            };
        case 'I':
            return {
                leftMeaning: 'Utilitarian, Objective, Unsentimentak',
                rightMeaning: 'Sensitive, Aesthetic, Sentimental',
            };
        case 'L':
            return {
                leftMeaning: 'Trusting, Unsuspecting, Accepting',
                rightMeaning: 'Vigilant, Suspicious, Skeptical, Wary',
            };
        case 'M':
            return {
                leftMeaning: 'Grounded, Practical, Solution-Oriented',
                rightMeaning: 'Abstracted, Imagivative, Idea-Oriented',
            };
        case 'N':
            return {
                leftMeaning: 'Forthright, Genuine, Artless',
                rightMeaning: 'Private, Discreet, Non-Disclosing',
            };
        case 'O':
            return {
                leftMeaning: 'Self-Assured, Unqorried, Complacent',
                rightMeaning: 'Apprehensive, Self-Doubting, Worried',
            };
        case 'Q1':
            return {
                leftMeaning: 'Traditional, Attached to Familiar',
                rightMeaning: 'Open to Change, Experimenting',
            };
        case 'Q2':
            return {
                leftMeaning: 'Group-Oriented, Affiliative',
                rightMeaning: 'Self-reliant, Solitary, Individualistic',
            };
        case 'Q3':
            return {
                leftMeaning: 'Tolerates Disorder, Unexating, Flexible',
                rightMeaning: 'Perfectionistic, Organized, Self-Disciplined',
            };
        case 'Q4':
            return {
                leftMeaning: 'Relaxed, Placid, Patient',
                rightMeaning: 'Tense, High Energy, Impatient, Driven',
            };
        default:
            return {
                leftMeaning: '',
                rightMeaning: '',
            };
    }
};

// Function to determine interpretation based on stenScore
const getStenScoreMeaning = (stenScore: number, factorLetter: string) => {
  const factorDescription = getFactorDescription(factorLetter);
  if (stenScore >= 1 && stenScore <= 3) {
      return factorDescription.leftMeaning;
  } else if (stenScore >= 4 && stenScore <= 7) {
      return 'Average';
  } else if (stenScore >= 8 && stenScore <= 10) {
      return factorDescription.rightMeaning;
  }
  return 'Invalid Sten Score';
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
                    <button
                      className={styles.viewInfo}
                      onClick={() => handleViewInfo(request.testID, request.note)}
                    >
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
  <div className={`${styles.declineModal} ${styles.show}`}>
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

{showTestInfo && (
  <div className={`${styles.testInfoModal} ${styles.show}`}>
    <div className={styles.testInfoModalContent}>
      <h3>Test Information</h3>
      <table className={styles.testInfoTable}>
        <thead>
          <tr>
            <th>Field</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {testDetails?.data?.map((testDetails: any) => (
            <React.Fragment key={testDetails._id}>
              <tr>
                <td>User ID</td>
                <td>{testDetails.userID}</td>
              </tr>
              <tr>
                <td>Name</td>
                <td>{testDetails.firstName} {testDetails.lastName}</td>
              </tr>
              <tr>
                <td>Age</td>
                <td>{testDetails.age}</td>
              </tr>
              <tr>
                <td>Sex</td>
                <td>{testDetails.sex}</td>
              </tr>
              <tr>
                <td>Course</td>
                <td>{testDetails.course}</td>
              </tr>
              <tr>
                <td>Year</td>
                <td>{testDetails.year}</td>
              </tr>
              <tr>
                <td>Section</td>
                <td>{testDetails.section}</td>
              </tr>
              <tr>
                <td>Test ID</td>
                <td>{testDetails.testID}</td>
              </tr>
              <tr>
                <td>Test Type</td>
                <td>{testDetails.testType}</td>
              </tr>
              <tr>
                <td>Test Date</td>
                <td>{new Date(testDetails.testDate).toLocaleString()}</td>
              </tr>
              {/* Display Total Score only if it exists */}
              {testDetails.totalScore && (
                <tr>
                  <td>Total Score</td>
                  <td>{testDetails.totalScore}</td>
                </tr>
              )}

              {testDetails.scoring && (
                <React.Fragment>
                  <tr>
                    <td className="scoring-label">Scoring</td>
                    <td>
                      <table className="scoring-table">
                        <thead>
                          <tr>
                            <th>Factor Letter</th>
                            <th>Raw Score</th>
                            <th>Sten Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {testDetails.scoring.scores.map((score: any, index: number) => (
                            <tr key={index}>
                              <td>{score.factorLetter}</td>
                              <td>{score.rawScore}</td>
                              <td>{score.stenScore}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </React.Fragment>
              )}


              <tr>
                <td>Interpretation</td>
                
                {testDetails.interpretation?.resultInterpretation ? (
                  <td>{testDetails.interpretation.resultInterpretation}</td>
                ) : (
                  <td>
                <th>Factor Letter</th>
                <th>Result Interpretation</th>

                 

                
                {testDetails.scoring.scores.map((score: any, index: number) => (
                            <tr key={index}>
                              <td>{score.factorLetter}</td>
                              <td>{getStenScoreMeaning(score.stenScore, score.factorLetter)}</td>

                            </tr>
                          ))}

                </td>
                )}


                
      
              </tr>

              {/* Show responses with isCorrect
              {test.responses && (
                <tr>
                  <td>Responses</td>
                  <td>
                    <ul>
                      {test.responses.map((response: any, index: number) => (
                        <li key={index}>
                          {response.questionID ? `Question ${response.questionID}: ` : ''} 
                          {response.selectedChoice ? (
                            response.selectedChoice.includes('http') ? (
                              <img src={response.selectedChoice} alt={`Question ${response.questionID}`} className={styles.responseImage} />
                            ) : (
                              `Selected: ${response.selectedChoice}`
                            )
                          ) : 'No choice selected'}
                          {response.equivalentScore ? `, Score: ${response.equivalentScore}` : ''}
                          {response.factorLetter ? `, Factor: ${response.factorLetter}` : ''}

                          {/* Display if the answer is correct or not */}
                          {/* {response.isCorrect !== undefined && (
                            <span>{response.isCorrect ? 'Correct' : 'Incorrect'}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr> */}
              {/* )} */} 
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <button onClick={() => setShowTestInfo(false)}>Close</button>
    </div>
  </div>
)}


    </div>
  );
};

export default GuidanceConsultation;
