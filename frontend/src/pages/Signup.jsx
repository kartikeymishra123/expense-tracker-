import React, { useState } from "react";
import axios from "axios";
import "../styles/Signup.css";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  let navigate = useNavigate();
  let api = import.meta.env.VITE_API_URL;

  let [fullname, setfullname] = useState("");
  let [email, setemail] = useState("");
  let [password, setpassword] = useState("");

  let handleSignUp = async () => {
    try {
      let res = await axios.post(`${api}/user/signup`, {
        fullname,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      alert("Sign up successful !");
      setemail("");
      setfullname("");
      setpassword("");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response.data.error || "Sign up failed ");
    }
  };

  return (
    <div className="total">
      <div className="name">
        <p>Fullname : </p>
        <input
          type="text"
          placeholder="enter your name"
          value={fullname}
          required
          onChange={(e) => setfullname(e.target.value)}
        />
      </div>
      <div className="email">
        <p>Email : </p>
        <input
          type="email"
          placeholder="eg. abc123@gmail.com"
          value={email}
          required
          onChange={(e) => setemail(e.target.value)}
        />
      </div>
      <div className="password">
        <p>Password : </p>
        <input
          type="password"
          placeholder="enter your password"
          value={password}
          required
          onChange={(e) => setpassword(e.target.value)}
        />
      </div>
      <button onClick={handleSignUp}>Signup</button>
    </div>
  );
};

export default Signup;
