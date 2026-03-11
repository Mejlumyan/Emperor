import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Ticket, ChevronRight, User } from "lucide-react";
import { Axios } from "../../../config/axios";
import { useTranslation } from "react-i18next";
import "./Register.scss";

export const Register = () => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const cinemaBackground =
  "https://www.publicdomainpictures.net/pictures/300000/nahled/cinema-movie.jpg"
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await Axios.post("/auth/register", {
        name,
        email,
        password,
      });

      const { accessToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.err || t("registration_failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-background">
        <img
          src={cinemaBackground}
          alt="Cinema"
          className="register-background__image"
        />
        <div className="register-background__overlay" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="register-wrapper"
      >
        <div className="register-card">
          <div className="register-header">
            <h1 className="register-header__title">
              FILM<span className="register-header__title--highlight">IFY</span>
            </h1>
            <p className="register-header__subtitle">
              Join the club and enjoy the best cinema experience!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="register-error"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="input-group">
              <div className="input-group__icon">
                <User className="input-group__icon-svg" size={16} />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input-group__field"
                placeholder="full name"
              />
            </div>

            <div className="input-group">
              <div className="input-group__icon">
                <Mail className="input-group__icon-svg" size={16} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-group__field"
                placeholder="email"
              />
            </div>

            <div className="input-group">
              <div className="input-group__icon">
                <Lock className="input-group__icon-svg" size={16} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-group__field"
                placeholder="create password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="register-submit"
            >
               Register
              {!loading && <ChevronRight size={18} />}
            </button>
          </form>

          <div className="register-footer">
            <Link to="/login" className="register-footer__link">
              Already a member?{" "}
              <span className="register-footer__link--highlight">
                login
              </span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};