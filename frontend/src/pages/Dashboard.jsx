import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import user from "../assets/user.png";
import expense from "../assets/expense.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../styles/Transaction.css";

const Dashboard = () => {
  let navigate = useNavigate();
  let api = import.meta.env.VITE_API_URL;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  let handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // transaction part
  let [transaction, settransaction] = useState([]);
  let [loading, setloading] = useState(false);
  let [error, seterror] = useState(null);

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    let fetchTransaction = async () => {
      setloading(true);
      seterror(null);
      try {
        let res = await axios.get(`${api}/transaction`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        settransaction(res.data || []);
      } catch (err) {
        console.log(err);
        seterror(err.response?.data?.message || "failed to fetch data");

        if (err.response?.status === 401 || err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        }
      } finally {
        setloading(false);
      }
    };
    fetchTransaction();
  }, [navigate]);

  let totalincome = transaction
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  let totalexpense = transaction
    .filter((t) => t.type === "spend")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  let balance = totalincome - totalexpense;

  let handleDelete = async (id) => {
    let token = localStorage.getItem("token");
    if (!token) return navigate("/");
    if (
      !window.confirm("Are you sure , you want to delete this transaction ?")
    ) {
      return;
    }
    try {
      await axios.delete(`${api}/transaction/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      settransaction(transaction.filter((t) => t._id !== id));
    } catch (err) {
      console.log(err);
      alert("failed to delete the transaction");
    }
  };

  let handleEdit = (id) => {
    navigate(`/edittransaction/${id}`);
  };

  return (
    <div>
      <div className="dashboard-container">
        <nav className="navbar">
          <div className="nav-left">
            <img src={expense} alt="" className="logo-img" />
            <h2>Expense Tracker</h2>
          </div>

          <div className="nav-right">
            <div className="account-section">
              <img
                src={user}
                alt="User"
                className="user-img"
                onClick={toggleDropdown}
              />
              {dropdownOpen && (
                <div className="dropdown">
                  <button onClick={() => navigate("/updateuser")}>
                    Edit Profile
                  </button>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
      <div className="transaction-container">
        {loading && <p>Loading your Transactions...</p>}
        {error && <p>{error}</p>}

        {!loading && !error && (
          <>
            <div className="summary">
              <h2>Summary </h2>
              <p>Total Income : {totalincome}</p>
              <p>Total Expense : {totalexpense}</p>
              <h3>Balance : {balance}</h3>
            </div>
            <div className="data">
              <h2>All Transactions</h2>
              {transaction.length === 0 ? (
                <p> No Transactions Found</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Tittle</th>
                      <th>Amount</th>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transaction.map((t) => (
                      <tr key={t._id}>
                        <td>{t.tittle}</td>
                        <td>{t.amount}</td>
                        <td
                          style={{
                            color: t.type === "income" ? "lightgreen" : "red",
                          }}
                        >
                          {t.type}
                        </td>
                        <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                        <td className="actions">
                          <FaEdit
                            className="icon edit"
                            title="Edit"
                            onClick={() => handleEdit(t._id)}
                          />
                          <FaTrash
                            className="icon delete"
                            title="Delete"
                            onClick={() => handleDelete(t._id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <button onClick={() => navigate("/addtransaction")}>
              ADD NEW +
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
