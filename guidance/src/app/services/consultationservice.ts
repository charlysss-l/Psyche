import axios from 'axios';

const API_URL = 'http://localhost:5000/api/consult/';

// Fetch consultation requests (for guidance view)
export const fetchConsultationRequests = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching consultation requests:', error);
        throw error;
    }
};
