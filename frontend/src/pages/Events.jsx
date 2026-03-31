import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  // 🔄 Fetch events
  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
      alert("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Navbar />

      <h2>🎟️ Events</h2>

      {/* 🔄 Loading */}
      {loading && <p>Loading events...</p>}

      {/* ❌ No events */}
      {!loading && events.length === 0 && (
        <p>No events available. Please contact admin.</p>
      )}

      {/* ✅ Events list */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {events.map((e) => (
          <div key={e._id} className="card" style={{ width: "250px" }}>
            <h3>{e.name || "Event"}</h3>

            <p><strong>ID:</strong> {e._id}</p>

            <button
              className="btn"
              onClick={() => (window.location = `/seats/${e._id}`)}
            >
              View Seats
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}