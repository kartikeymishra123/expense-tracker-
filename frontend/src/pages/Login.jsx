import React, { useState } from "react";
import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  let api = import.meta.env.VITE_API_URL;
  let navigate = useNavigate();
  let [email, setemail] = useState("");
  let [password, setpassword] = useState("");

  let handleLogin = async () => {
    try {
      let res = await axios.post(`${api}/user/login`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      alert("Login Successful!");
      setemail("");
      setpassword("");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response.data.error || "Login failed ");
    }
  };

  return (
    <div className="total">
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
      <button onClick={handleLogin}>Login</button>
      <p className="redirect">
        Don't have an account ?{" "}
        <Link to="/signup" className="link">
          Sign up here
        </Link>
      </p>
    </div>
  );
};

export default Login;
