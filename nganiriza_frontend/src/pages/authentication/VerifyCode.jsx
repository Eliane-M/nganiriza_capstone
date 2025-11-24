// src/pages/VerifyAndSetPassword.jsx
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
import "../../assets/css/authPages/verifycode.scss";

const schema = z.object({
  code: z.string().length(6, "Enter 6 characters").regex(/^[A-Z0-9]+$/i, "Only letters & numbers"),
  password: z.string().min(8, "Password too short"),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, {
  message: "Passwords don't match",
  path: ["confirm"],
});

export default function VerifyAndSetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const { t } = useTranslation(language);

  // PROTECT: No email? Back to start
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!state?.email) {
      navigate("/reset-password");
    }
  }, [state, navigate]);


  const email = state.email;

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/reset/confirm/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code: data.code.toUpperCase(),
          new_password: data.password,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Invalid code");

      toast.success("Password changed! 🎉");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="all-in-one-page">
      <div className="card">
        <div className="icon">
          <Lock className="lock" />
        </div>

        <h1>{t('auth.verifyCode.title')}</h1>
        <p className="subtitle">
          {t('auth.verifyCode.subtitle')} <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="form">
          {/* CODE */}
          <div className="field">
            <label>{t('auth.verifyCode.enterCode')}</label>
            <input
              {...register("code")}
              maxLength="6"
              placeholder={t('auth.verifyCode.enterCode')}
              className="code-input"
              autoFocus
            />
            {errors.code && <span className="err">{errors.code.message}</span>}
          </div>

          {/* PASSWORD */}
          <div className="field">
            <label>{t('auth.setNewPassword.newPassword')}</label>
            <input
              {...register("password")}
              type="password"
              placeholder={t('auth.setNewPassword.newPassword')}
            />
            {errors.password && <span className="err">{errors.password.message}</span>}
          </div>

          {/* CONFIRM */}
          <div className="field">
            <label>{t('auth.setNewPassword.confirmPassword')}</label>
            <input
              {...register("confirm")}
              type="password"
              placeholder={t('auth.setNewPassword.confirmPassword')}
            />
            {errors.confirm && <span className="err">{errors.confirm.message}</span>}
          </div>

          <button type="submit" disabled={isLoading} className="btn">
            {isLoading ? t('common.loading') : t('auth.setNewPassword.updatePassword')}
          </button>
        </form>

        <a href="/login" className="back">← {t('auth.verifyCode.back')}</a>
      </div>
    </div>
  );
}