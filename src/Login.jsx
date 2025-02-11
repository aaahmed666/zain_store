import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./assets/zain_logo.jpg";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "zain_store" && password === "ahmed&donia") {
      localStorage.setItem("token", "fake-jwt-token");
      navigate("/");
    } else {
      setError("Invalid credentials!");
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 px-3">
      <img
        src={logo}
        alt="Zain Store Logo"
        className="mb-3"
        style={{ height: "120px", objectFit: "cover" }} // Reduced size for mobile
      />
      <div
        className="card p-4 w-100"
        style={{ maxWidth: "400px" }}
      >
        <h2 className="text-center mb-3">تسجيل الدخول</h2>
        {error && <div className="alert alert-danger text-center">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">الاسم</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">الباسورد</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
          >
            دخول
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
