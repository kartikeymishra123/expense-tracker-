import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/AddTransaction.css";

const EditTransaction = () => {
  let api = import.meta.env.VITE_API_URL;
  const [tittle, settittle] = useState("");
  const [amount, setamount] = useState();
  const [type, settype] = useState("");
  let [loading, setloading] = useState(false);
  const navigate = useNavigate();
  let { id } = useParams();

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (!token) {
      return navigate("/");
    }
    let fetchTransaction = async () => {
      setloading(true);
      try {
        let res = await axios.get(`${api}/transaction/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        let t = res.data;
        settittle(t.tittle);
        setamount(t.amount);
        settype(t.type);
      } catch (err) {
        console.log(err);
        navigate("/dashboard");
      } finally {
        setloading(false);
      }
    };

    fetchTransaction();
  }, [id, navigate]);

  const handleEditItem = async (i) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    try {
      await axios.put(
        `${api}/transaction/${id}`,
        { tittle, amount: Number(amount), type },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(" Transaction updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      alert(" Failed to update transaction");
    }
  };

  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        Loading transaction...
      </p>
    );
  }

  return (
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

      <button className="add-btn" onClick={handleEditItem}>
        Update Transaction
      </button>
    </div>
  );
};

export default EditTransaction;
