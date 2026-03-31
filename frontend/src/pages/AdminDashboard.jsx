import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const [eventName, setEventName] = useState("");
  const [eventId, setEventId] = useState("");
  const [totalSeats, setTotalSeats] = useState(0);

  const [bookings, setBookings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchBookings();
    fetchTransactions();
  }, []);

  // ================= CREATE EVENT =================
  const createEvent = async () => {
    try {
      const res = await API.post("/admin/create-event", {
        name: eventName
      });
      alert("Event Created 🎉");
      setEventId(res.data.eventId);
    } catch (err) {
      alert("Error creating event");
    }
  };

  // ================= CREATE SEATS =================
  const createSeats = async () => {
    try {
      await API.post("/admin/create-seats", {
        eventId,
        totalSeats: Number(totalSeats)
      });
      alert("Seats Created 🎟️");
    } catch (err) {
      alert("Error creating seats");
    }
  };

  // ================= FETCH BOOKINGS =================
  const fetchBookings = async () => {
    try {
      const res = await API.get("/admin/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= FETCH TRANSACTIONS =================
  const fetchTransactions = async () => {
    try {
      const res = await API.get("/admin/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= CANCEL + REFUND =================
  const cancelBooking = async (id) => {
    try {
      await API.post("/admin/cancel-booking", {
        bookingId: id
      });
      alert("Cancelled & Refunded 💰");
      fetchBookings();
      fetchTransactions();
    } catch (err) {
      alert("Cancel failed");
    }
  };

  return (
    <div className="container">
      <Navbar />

      <h2>👑 Admin Dashboard</h2>

      {/* CREATE EVENT */}
      <div className="card">
        <h3>Create Event</h3>
        <input
          placeholder="Event Name"
          onChange={(e) => setEventName(e.target.value)}
        />
        <button className="btn" onClick={createEvent}>
          Create Event
        </button>
      </div>

      {/* CREATE SEATS */}
      <div className="card">
        <h3>Create Seats</h3>
        <input
          placeholder="Event ID"
          onChange={(e) => setEventId(e.target.value)}
        />
        <input
          placeholder="Total Seats"
          onChange={(e) => setTotalSeats(e.target.value)}
        />
        <button className="btn" onClick={createSeats}>
          Create Seats
        </button>
      </div>

      {/* FILTER */}
      <div className="card">
        <h3>🔍 Filter Bookings</h3>
        <input
          placeholder="Search by UserId"
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* BOOKINGS TABLE */}
      <div className="card">
        <h3>📜 All Bookings</h3>

        <table border="1" width="100%">
          <thead>
            <tr>
              <th>User</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Seats</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings
              .filter((b) => b.userId.includes(filter))
              .map((b) => (
                <tr key={b._id}>
                  <td>{b.userId}</td>
                  <td>₹{b.amount}</td>
                  <td>{b.status}</td>
                  <td>{b.seatIds?.length}</td>
                  <td>
                    {b.status !== "CANCELLED" && (
                      <button
                        className="btn-danger"
                        onClick={() => cancelBooking(b._id)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="card">
        <h3>💰 All Transactions</h3>

        <table border="1" width="100%">
          <thead>
            <tr>
              <th>User</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((t) => (
              <tr key={t._id}>
                <td>{t.userId}</td>
                <td>{t.type}</td>
                <td>₹{t.amount}</td>
                <td>
                  {t.createdAt
                    ? new Date(t.createdAt).toLocaleString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}