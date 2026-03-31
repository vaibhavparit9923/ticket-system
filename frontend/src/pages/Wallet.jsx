import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function Wallet() {
  const [amount, setAmount] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const res = await API.get(`/transactions/${userId}`);
    setTransactions(res.data);
  };

  const handleAdd = async () => {
    await API.post("/add-money", {
      userId,
      amount: Number(amount)
    });
    fetchTransactions();
  };

  return (
    <div>
      <Navbar />
      <h2>Wallet</h2>

      <input onChange={(e)=>setAmount(e.target.value)} />
      <button onClick={handleAdd}>Add Money</button>

      <h3>Transactions</h3>

      {transactions.map((t) => (
        <div key={t._id}>
          {t.type} - ₹{t.amount}
        </div>
      ))}
    </div>
  );
}