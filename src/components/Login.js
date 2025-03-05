import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Retrieve user data from localStorage (for now, will be replaced by API call)
    const storedUser = JSON.parse(localStorage.getItem(email));

    if (!storedUser) {
      alert("User not found! Please sign up.");
      return;
    }

    if (storedUser.password === password) {
      alert("Login successful! Redirecting to dashboard...");
      localStorage.setItem("loggedInUser", email);
      navigate("/dashboard"); // Change path as needed
    } else {
      alert("Incorrect password! Try again.");
    }
  };

  return (
    <div className="container">
        <div className="background-box-1"></div>
      <div className="background-box-2"></div>

      <div className="form-container">
        <div className="left-box1">
          <h2>WELCOME BACK!</h2>
          <p>Don't have an account? Click below to sign up.</p>
          <button className="switch-btn" onClick={() => navigate("/signup")}>
            SIGN UP
          </button>
        </div>

        <div className="right-box">
          <h2>Welcome Back</h2>
          <p>Please log in to continue</p>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">LOGIN</button>
          </form>
          <p className="forgot-password">
            <a href="#">Forgot Password?</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
