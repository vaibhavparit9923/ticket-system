import axios from "axios";

// 🔥 Backend base URL
const BASE_URL = "https://ticket-system-8zeq.onrender.com";

export const API = {
  login: `${BASE_URL}/login`,
  register: `${BASE_URL}/register`,
  events: `${BASE_URL}/events`,
  book: `${BASE_URL}/book`,
};
// 🔐 Token automatically attach
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;