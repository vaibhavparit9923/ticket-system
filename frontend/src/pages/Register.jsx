import { useState } from "react";
import API from "../services/api";

export default function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleRegister = async () => {
    try {
      await API.post("/register", data);
      alert("Registered Successfully");
      window.location = "/";
    } catch (err) {
      alert(err.response?.data?.detail);
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <input placeholder="Name" onChange={(e)=>setData({...data,name:e.target.value})}/>
      <input placeholder="Email" onChange={(e)=>setData({...data,email:e.target.value})}/>
      <input type="password" placeholder="Password" onChange={(e)=>setData({...data,password:e.target.value})}/>

      <button onClick={handleRegister}>Register</button>
    </div>
  );
}