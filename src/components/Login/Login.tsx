import React, { useState } from "react";
import { Eye, EyeOff, MessageCircle } from "lucide-react";
import Button from "../Button/Button";
import styles from "./Login.module.css";

// Function to generate star data
const generateStars = () => {
  const stars = [];
  for (let i = 0; i < 50; i++) {
    stars.push({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${2 + Math.random() * 3}s`,
    });
  }
  return stars;
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [starsData] = useState(generateStars);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
  };

  return (
    <div className={styles.loginContainer}>
      {/* Animated background stars */}
      <div className={styles.starsContainer}>
        {starsData.map((star) => (
          <div
            key={star.id}
            className={styles.star}
            style={{
              left: star.left,
              top: star.top,
              animationDelay: star.animationDelay,
              animationDuration: star.animationDuration,
            }}
          />
        ))}
      </div>

      {/* Comet trail effect */}
      <div className={`${styles.comet} ${styles.comet1}`}>
        <div className={styles.cometCore}></div>
        <div className={`${styles.cometTrail} ${styles.trail1}`}></div>
        <div className={`${styles.cometTrail} ${styles.trail2}`}></div>
      </div>

      {/* Another comet */}
      <div className={`${styles.comet} ${styles.comet2}`}>
        <div className={`${styles.cometCore} ${styles.cometCorePink}`}></div>
        <div className={`${styles.cometTrail} ${styles.trailPink}`}></div>
      </div>

      {/* Login container */}
      <div className={styles.loginWrapper}>
        {/* Glowing backdrop */}
        <div className={styles.loginBackdrop}></div>

        {/* Main login card */}
        <div className={styles.loginCard}>
          {/* Header */}
          <div className={styles.loginHeader}>
            <div className={styles.logoContainer}>
              <MessageCircle className={styles.logoIcon} />
            </div>
            <h1 className={styles.appTitle}>CometChat</h1>
            <p className={styles.appSubtitle}>Connect across the cosmos</p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.formInput}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>
                Password
              </label>
              <div className={styles.passwordInputWrapper}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${styles.formInput} ${styles.passwordInput}`}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.passwordToggle}
                >
                  {showPassword ? (
                    <EyeOff className={styles.toggleIcon} />
                  ) : (
                    <Eye className={styles.toggleIcon} />
                  )}
                </button>
              </div>
            </div>

            <div className={styles.formOptions}>
              <label className={styles.checkboxWrapper}>
                <input type="checkbox" className={styles.checkboxInput} />
                <span className={styles.checkboxLabel}>Remember me</span>
              </label>
              <button type="button" className={styles.forgotPassword}>
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              children={
                isLoading ? (
                  <div className={styles.loadingContent}>
                    <div className={styles.loadingSpinner}></div>
                    Launching...
                  </div>
                ) : (
                  "Launch Into Chat 🚀"
                )
              }
            />
          </form>

          {/* Divider */}
          <div className={styles.divider}>
            <div className={styles.dividerLine}></div>
            <span className={styles.dividerText}>or</span>
            <div className={styles.dividerLine}></div>
          </div>

          {/* Sign up link */}
          <p className={styles.signupText}>
            New to the cosmos?{" "}
            <button className={styles.signupLink}>Create account</button>
          </p>
        </div>
      </div>

      {/* Additional cosmic elements */}
      <div className={`${styles.cosmicElement} ${styles.element1}`}></div>
      <div className={`${styles.cosmicElement} ${styles.element2}`}></div>
      <div className={`${styles.cosmicElement} ${styles.element3}`}></div>
    </div>
  );
}
