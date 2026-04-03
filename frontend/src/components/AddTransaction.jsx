import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AddTransaction.css";

const AddTransaction = () => {
  let api = import.meta.env.VITE_API_URL;
  const [tittle, settittle] = useState("");
  const [amount, setamount] = useState("");
  const [type, settype] = useState("");
  const navigate = useNavigate();

  const handleAddItem = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    try {
      await axios.post(
        `${api}/transaction/add`,
        { tittle, amount, type },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(" Transaction added successfully!");
      navigate("/dashboard");
    } catch (err) {
      alert(" Failed to add transaction");
    }
  };

  return (
    <div>
      <div className="add-transaction">
        <h2>Add Transaction</h2>

        <div className="input-group">
          <p>Title</p>
          <input
            type="text"
            value={tittle}
            onChange={(e) => settittle(e.target.value)}
            placeholder="Enter title..."
          />
        </div>

        <div className="input-group">
          <p>Amount</p>
          <input
            type="number"
            value={amount}
            onChange={(e) => setamount(e.target.value)}
            placeholder="Enter amount..."
          />
        </div>

        <div className="input-group">
          <p>Type</p>
          <div className="type-selector">
            <button
              className={type === "income" ? "active" : ""}
              onClick={() => settype("income")}
            >
              Income
            </button>
            <button
              className={type === "spend" ? "active" : ""}
              onClick={() => settype("spend")}
            >
              Spend
            </button>
          </div>
        </div>

        <button className="add-btn" onClick={handleAddItem}>
          + Add Transaction
        </button>
      </div>
    </div>
  );
};

export default AddTransaction;
