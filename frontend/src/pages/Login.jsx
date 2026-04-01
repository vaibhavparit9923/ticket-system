import React, { useState } from "react";
import { loginUser } from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser({
        email,
        password,
      });

      console.log("Login Response:", res);

      if (!res) {
        alert("Server Error ❌");
        return;
      }

      if (res.token) {
        alert("Login Successful ✅");

        // Save token
        localStorage.setItem("token", res.token);

        // OPTIONAL: redirect (future use)
        window.location.href = "/";
      } else {
        alert(res.message || "Invalid Credentials ❌");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Something went wrong ❌");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br /><br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;