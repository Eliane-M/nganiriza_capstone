import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock, CheckCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LanguageContext } from '../../contexts/AppContext';
import { useTranslation } from '../../utils/translations';
import BASE_URL from "../../config";
import "../../assets/css/authPages/setnewpassword.css"; // We'll make this

const schema = z.object({
  code: z.string().length(6, "Enter your 6-character code"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function SetNewPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const { t } = useTranslation(language);

  // Redirect if no email
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!state?.email) {
      navigate("/reset-password");
    }
  }, [state, navigate]);

  // Return early if no email (after hooks are called)
  if (!state?.email) {
    return null;
  }

  const email = state.email;

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/reset/confirm/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
        //   code: data.code.toUpperCase(),
          new_password: data.password,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Invalid or expired code");
      }

      toast.success("Password changed! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="new-password-page">
      <div className="new-password-card">
        <div className="icon-circle success">
          <CheckCircle className="success-icon" />
        </div>

        <h1>{t('auth.setNewPassword.title')}</h1>
        <p className="subtitle">
          {t('auth.setNewPassword.subtitle')}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="form">
          {/* 6-Char Code */}
          <div className="input-group">
            <label>{t('auth.verifyCode.enterCode')}</label>
            <input
              type="text"
              maxLength="6"
              placeholder={t('auth.verifyCode.enterCode')}
              {...register("code")}
              className="code-input"
              style={{ textTransform: "uppercase", letterSpacing: "0.5rem", textAlign: "center" }}
            />
            {errors.code && <span className="error-text">{errors.code.message}</span>}
          </div>

          {/* New Password */}
          <div className="input-group">
            <label>{t('auth.setNewPassword.newPassword')}</label>
            <input
              type="password"
              placeholder={t('auth.setNewPassword.newPassword')}
              {...register("password")}
            />
            {errors.password && <span className="error-text">{errors.password.message}</span>}
          </div>

          {/* Confirm Password */}
          <div className="input-group">
            <label>{t('auth.setNewPassword.confirmPassword')}</label>
            <input
              type="password"
              placeholder={t('auth.setNewPassword.confirmPassword')}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword.message}</span>}
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? t('common.loading') : t('auth.setNewPassword.updatePassword')}
          </button>
        </form>

        <a href="/login" className="back-link">
          ← {t('auth.setNewPassword.backToLogin')}
        </a>
      </div>
    </div>
  );
}