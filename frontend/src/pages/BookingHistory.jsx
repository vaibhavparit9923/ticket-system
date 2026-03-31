import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const res = await API.get(`/bookings/${userId}`);
    setBookings(res.data);
  };

  return (
    <div>
      <Navbar />
      <h2>Booking History</h2>

      {bookings.map((b) => (
        <div key={b._id}>
          Seats: {b.seatIds.join(", ")} | ₹{b.amount}
        </div>
      ))}
    </div>
  );
}