import axios from "axios";

const API = axios.create({
  baseURL: "https://ticket-system-8zeq.onrender.com", // 👉 tuzha backend URL
});

// LOGIN API
export const loginUser = async (data) => {
  try {
    const res = await API.post("/login", data);
    return res.data;
  } catch (error) {
    console.error("Login API Error:", error);
    return null;
  }
};