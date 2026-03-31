import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function Seats() {
  const { eventId } = useParams();
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchSeats();
  }, []);

  // 🔄 Fetch seats
  const fetchSeats = async () => {
    try {
      const res = await API.get(`/seats/${eventId}`);
      setSeats(res.data);
    } catch (err) {
      console.error(err);
      alert("Error loading seats");
    } finally {
      setLoading(false);
    }
  };

  // ⏳ Reserve seat
  const handleReserve = async (seatId) => {
    try {
      await API.post("/reserve", {
        seatId,
        userId
      });
      fetchSeats();
    } catch (err) {
      alert(err.response?.data?.detail || "Reserve failed");
    }
  };

  // 🎯 Select reserved seats
  const toggleSelect = (seatId) => {
    if (selected.includes(seatId)) {
      setSelected(selected.filter(id => id !== seatId));
    } else {
      setSelected([...selected, seatId]);
    }
  };

  // 💳 Book seats
  const handleBook = async () => {
    if (selected.length === 0) {
      alert("Select seats first");
      return;
    }

    try {
      await API.post("/book", {
        userId,
        seatIds: selected,
        amount: selected.length * 100
      });

      alert("Booking successful 🎉");
      setSelected([]);
      fetchSeats();
    } catch (err) {
      alert(err.response?.data?.detail || "Booking failed");
    }
  };

  return (
    <div className="container">
      <Navbar />

      <h2>💺 Select Seats</h2>

      {/* Loading */}
      {loading && <p>Loading seats...</p>}

      {/* Seats Grid */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {seats.map((s) => {
          const isSelected = selected.includes(s._id);

          return (
            <button
              key={s._id}
              style={{
                background:
                  s.status === "AVAILABLE"
                    ? "#2ecc71"
                    : s.status === "RESERVED"
                    ? "#f39c12"
                    : "#e74c3c",
                color: "white",
                borderRadius: "5px",
                padding: "10px",
                minWidth: "50px",
                border: isSelected ? "3px solid black" : "none",
                cursor: "pointer"
              }}
              disabled={s.status === "BOOKED"}
              onClick={() =>
                s.status === "AVAILABLE"
                  ? handleReserve(s._id)
                  : toggleSelect(s._id)
              }
            >
              {s.seatNumber}
            </button>
          );
        })}
      </div>

      {/* Booking Section */}
      <div style={{ marginTop: "20px" }}>
        <h3>Selected Seats: {selected.length}</h3>

        <button className="btn" onClick={handleBook}>
          Book Seats (₹{selected.length * 100})
        </button>
      </div>
    </div>
  );
}