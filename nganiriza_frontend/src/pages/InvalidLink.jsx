// src/pages/InvalidLink.jsx
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import "../assets/css/authPages/invalidlink.css";

export default function InvalidLink() {
  return (
    <div className="invalid-page">
      <div className="invalid-card">
        <div className="icon-circle">
          <AlertCircle className="alert-icon" />
        </div>

        <h1>Invalid Link</h1>
        <p className="subtitle">
          This password reset link is invalid or has expired
        </p>

        <div className="message-box">
          <p>Please request a new password reset link to continue.</p>

          <Link to="/reset-password">
            <button className="request-btn">Request New Link</button>
          </Link>

          <Link to="/login" className="back-btn">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}