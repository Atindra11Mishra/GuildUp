import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/payment`;

// Create a Razorpay order
export const createOrder = async (amount) => {
  const response = await axios.post(`${API_URL}/create-order`, { amount });
  return response.data;
};

// Verify payment
export const verifyPayment = async (data) => {
  const response = await axios.post(`${API_URL}/verify-payment`, data);
  return response.data;
};
