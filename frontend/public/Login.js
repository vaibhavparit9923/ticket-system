import { useState } from "react";
import API from "../services/api";

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    try {
      const res = await API.post("/login", data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      alert("Login Success");
      window.location = "/events";

    } catch (err) {
      alert(err.response?.data?.detail || "Error");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setData({ ...data, password: e.target.value })}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}