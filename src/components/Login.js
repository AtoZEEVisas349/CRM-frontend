import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/styles.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("All fields are required!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        toast.success("Login successful! Redirecting...", { className: "toast-success" });
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        toast.error(response.data.message || "Login failed!", { className: "toast-error" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "⚠️ An error occurred during login.", {
        className: "toast-error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <ToastContainer position="top-right" autoClose={3000} toastClassName="toast-success" />
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
         
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "LOGIN"}
            </button>
            <p className="link">
            <a href="/forgot-password" className="forgot-password-link">Forgot Password?</a>
           </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
