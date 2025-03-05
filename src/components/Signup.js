import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      alert("All fields are required!");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (localStorage.getItem(email)) {
      alert("User already exists! Please log in.");
      return;
    }

    localStorage.setItem(
      email,
      JSON.stringify({ username, email, password })
    );

    alert("Signup successful! Redirecting to login.");
    navigate("/login");
  };

  return (
    <div className="container">
        <div className="background-box-1"></div>
      <div className="background-box-2"></div>

      <div className="form-container">
        <div className="left-box">
          <h2>WELCOME BACK!</h2>
          <p>Already have an account? Click below to log in.</p>
          <button className="switch-btn" onClick={() => navigate("/login")}>
            SIGN IN
          </button>
        </div>

        <div className="right-box">
          <h2>Create Account</h2>
          <div className="social-icons">
            <i className="fab fa-facebook-f"></i>
            <i className="fab fa-twitter"></i>
            <i className="fab fa-linkedin-in"></i>
          </div>

          <p>or use your email account</p>
          <form onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
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
            <button type="submit">SIGN UP</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
