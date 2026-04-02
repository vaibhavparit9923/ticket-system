import axios from "axios";

const API = axios.create({
  baseURL: "https://your-backend-url.onrender.com", // <-- change this
});

export default API;

// Example functions
export const loginUser = (data) => API.post("/login", data);
export const registerUser = (data) => API.post("/register", data);