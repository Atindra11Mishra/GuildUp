import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/calendar`;

export const fetchEvents = async (start, end) => {
  try {
    const response = await axios.get(`${API_URL}/events`, {
      params: { start, end },
    });
    return response.data.events;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};
