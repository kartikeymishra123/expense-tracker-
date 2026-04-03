import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/UpdateUser.css";

const UpdateUser = () => {
  let api = import.meta.env.VITE_API_URL;
  const [fullname, setfullname] = useState("");
  const [email, setemail] = useState("");
  let [loading, setloading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (!token) {
      return navigate("/");
    }
    let fetchUser = async () => {
      setloading(true);
      try {
        let res = await axios.get(`${api}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        let t = res.data;
        setfullname(t.fullname || "");
        setemail(t.email || "");
      } catch (err) {
        console.log(err);
        navigate("/dashboard");
      } finally {
        setloading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleUpdateUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    try {
      await axios.put(
        `${api}/user/update`,
        { fullname, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(" User updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      alert(" Failed to update User");
    }
  };

  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        Loading User Information...
      </p>
    );
  }
  return (
    <div className="update-user-container">
      <h2>Update User</h2>

      <div className="input-group">
        <label>Fullname:</label>
        <input
          type="text"
          value={fullname}
          onChange={(e) => setfullname(e.target.value)}
          required
        />
      </div>

      <div className="input-group">
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setemail(e.target.value)}
          required
        />
      </div>

      <button onClick={handleUpdateUser} className="update-btn">
        Update User
      </button>
    </div>
  );
};

export default UpdateUser;
