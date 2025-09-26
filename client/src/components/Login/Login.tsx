import React, { useState } from "react";
import { Eye, EyeOff, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Button from "../Button/Button";
import useAuth from "../../context/useAuth"; // Import the hook
import styles from "./Login.module.css";

type AccountData = {
  login: string; // email OR username
  password: string;
};

type AccountErrors = Partial<Record<keyof AccountData, string>>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [logWithEmail, setLogWithEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState<AccountErrors>({});
  const { login } = useAuth(); // Use the AuthContext login function

  const [accountData, setAccountData] = useState<AccountData>({
    login: "",
    password: "",
  });

  const validateData = () => {
    const errors: AccountErrors = {};
    if (!accountData.login) {
      errors.login = `${logWithEmail ? "Email" : "Username"} is required`;
    }
    if (!accountData.password.trim()) {
      errors.password = "Password is required";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateData()) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      // Use the AuthContext login function instead of direct fetch
      await login(accountData.login, accountData.password);

      // Clear form data
      setAccountData({
        login: "",
        password: "",
      });

      console.log("logged in successfully");
      // Navigate to home page
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ login: "Invalid credentials. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      {/* Login container */}
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
            <label
              htmlFor={logWithEmail ? "email" : "username"}
              className={styles.formLabel}
            >
              {logWithEmail ? "Email" : "Username"}
            </label>
            <input
              id={logWithEmail ? "email" : "username"}
              type={logWithEmail ? "email" : "text"}
              value={accountData.login}
              onChange={(e) =>
                setAccountData({ ...accountData, login: e.target.value })
              }
              className={`${styles.formInput} ${
                errors.login ? styles.error : ""
              }`}
              placeholder={`Enter your ${logWithEmail ? "email" : "username"}`}
              required
            />
            {errors.login && (
              <span className={styles.errorText}>{errors.login}</span>
            )}
            <span className={styles.loginSpan}>
              <button
                type="button" // Add type="button" to prevent form submission
                className={styles.loginToggle}
                onClick={() => setLogWithEmail((prev) => !prev)}
              >
                {`Log in with ${logWithEmail ? "username" : "email"}`}
              </button>
            </span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              Password
            </label>
            <div className={styles.passwordInputWrapper}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={accountData.password}
                onChange={(e) =>
                  setAccountData({ ...accountData, password: e.target.value })
                }
                className={`${styles.formInput} ${styles.passwordInput} ${
                  errors.password ? styles.error : ""
                }`}
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
            {errors.password && (
              <span className={styles.errorText}>{errors.password}</span>
            )}
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
          <Link to="/create-account" className={styles.signupLink}>
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
