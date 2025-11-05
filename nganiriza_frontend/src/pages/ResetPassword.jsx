// src/pages/ResetPassword.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../assets/css/authPages/resetPass.css";
import BASE_URL from "../config";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/reset/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      if (!res.ok) throw new Error("Failed to send reset link");

      toast.success("Check your email for the reset link!");
      navigate("/verify-code", { state: { email: data.email } });
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-card">
        <div className="logo">
          <Lock className="lock-icon" />
        </div>

        <h1>Reset Password</h1>
        <p className="subtitle">
          Enter your email to receive reset instructions
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email address"
              {...register("email")}
              disabled={isLoading}
              className={errors.email ? "error" : ""}
            />
            {errors.email && (
              <span className="error-text">{errors.email.message}</span>
            )}
          </div>

          <div className="info-box">
            <div className="info-icon">i</div>
            <div>
              <strong>What happens next?</strong>
              <p>
                We'll send you an OTP code to reset your password.
                <br />
                The link will expire in 24 hours for your security.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset OTP"}
          </button>
        </form>

        <a href="/login" className="back-link">
          ← Back to Log In
        </a>
      </div>
    </div>
  );
}