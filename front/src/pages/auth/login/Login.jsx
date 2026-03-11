import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Ticket, ChevronRight, AlertCircle } from "lucide-react";
import { Axios } from "../../../config/axios";
import { GoogleLogin } from "@react-oauth/google";
import { useTranslation } from "react-i18next";

export const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const cinemaBackground =
    "https://open-stand.org/wp-content/uploads/2016/04/International-Union-of-Cinemas-Calls-for-Open-Standards-in-the-Cinema-Industry.jpg";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked) return;

    setError("");
    setLoading(true);
    try {
      const response = await Axios.post("/auth/login", { email, password });
      localStorage.setItem("accessToken", response.data.accessToken);
      window.location.href = "/";
    } catch (err) {
      const errorMessage = err.response?.data?.error || t("invalid_credentials");
      setError(errorMessage);

      if (
        errorMessage.toLowerCase().includes("locked") ||
        errorMessage.toLowerCase().includes("blocked")
      ) {
        setIsLocked(true);
        setTimeout(() => setIsLocked(false), 180000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError("");

      const res = await Axios.post("/auth/google-login", {
        token: credentialResponse.credential,
      });

      if (res.data.accessToken) {
        localStorage.setItem("accessToken", res.data.accessToken);
        window.location.href = "/";
      }
    } catch (err) {
      setError(err.response?.data?.message || t("google_login_failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] overflow-hidden relative p-4 font-sans">
      <div className="absolute inset-0 z-0">
        <img
          src={cinemaBackground}
          className="w-full h-full object-cover opacity-60"
          alt="Cinema background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/60" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[460px]"
      >
        <div className="bg-black/60 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl">
          <div className="text-center mb-8">
           
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
              FILM<span className="text-yellow-600">IFY</span>
            </h1>
            <p className="text-gray-400 text-[10px] tracking-[0.3em] uppercase mt-2 font-bold">
              Just Enjoy the Show
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold text-center border ${
                    isLocked
                      ? "bg-orange-500/10 border-orange-500/50 text-orange-500"
                      : "bg-red-500/10 border-red-500/50 text-red-500"
                  }`}
                >
                  <AlertCircle size={16} />
                  <span className="flex-1">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-600 transition-colors"
                  size={20}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLocked}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-red-600/50 transition-all text-sm disabled:opacity-50"
                  placeholder="email"
                  required
                />
              </div>

              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-600 transition-colors"
                  size={20}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLocked}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-red-600/50 transition-all text-sm disabled:opacity-50"
                  placeholder="password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || isLocked}
              className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 ${
                isLocked
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20"
              }`}
            >
              {isLocked
                ? t("locked_account")
                : loading
                ? t("rolling")
                : t("login")}
              {!loading && !isLocked && <ChevronRight size={20} />}
            </button>
          </form>

          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError(t("google_login_failed"))}
              theme="filled_black"
              shape="pill"
              width="320"
            />
          </div>

          <div className="mt-8 text-center pt-6 border-t border-white/5">
            <Link
              to="/register"
              className="text-gray-400 text-xs font-bold hover:text-white transition-colors uppercase tracking-widest"
            >
              have no account?
              <span className="text-red-600 ml-1 underline decoration-2 underline-offset-4">
                Join us
              </span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
