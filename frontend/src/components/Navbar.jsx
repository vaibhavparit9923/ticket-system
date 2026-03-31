import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <button onClick={() => navigate("/events")}>Events</button>
      <button onClick={() => navigate("/wallet")}>Wallet</button>
      <button onClick={() => navigate("/history")}>History</button>
      <button onClick={() => navigate("/admin")}>Admin</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}