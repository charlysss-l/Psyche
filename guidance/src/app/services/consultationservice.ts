import axios from 'axios';
import backendUrl from '../../config';

const API_URL = `${backendUrl}/api/consult/`;

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
