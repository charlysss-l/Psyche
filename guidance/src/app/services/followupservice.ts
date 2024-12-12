import axios from "axios";
import backendUrl from "../../config";

const API_URL = `${backendUrl}/api/followup`;

export const fetchFollowUpSchedules = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching follow-up schedules:", error);
    throw error;
  }
};
