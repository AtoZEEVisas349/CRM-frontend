import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/styles.css";

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validation without toast
    if (!username || !email || !password) {
      setError("All fields are required!");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setError(""); // Clear previous errors

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/signup", {
        username,
        email,
        password,
      });

      toast.success("Signup successful! Redirecting to login...", { className: "toast-success" });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed! Try again.", {
        className: "toast-error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <ToastContainer position="top-right" autoClose={3000} />
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
          {error && <p className="error-message">{error}</p>} {/* Show validation errors here */}
          
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
            <button type="submit" disabled={loading}>
              {loading ? "Signing up..." : "SIGN UP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
