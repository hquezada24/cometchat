import "./CreateAccount.css";
import { useState } from "react";
import Button from "../Button/Button";
import { Link, useNavigate } from "react-router-dom";
import { MessageCircle, Eye, EyeOff } from "lucide-react";

type AccountData = {
  fullName: string;
  username: string;
  email: string;
  password: string;
};

type AccountErrors = Partial<Record<keyof AccountData, string>>;

const CreateAccount = () => {
  const [accountData, setAccountData] = useState<AccountData>({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<AccountErrors>({});
  const [matchError, setMatchError] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const validateData = () => {
    const errors: AccountErrors = {};
    if (!accountData.fullName.trim()) {
      errors.fullName = "Full name is required";
    }
    if (!accountData.username.trim()) {
      errors.username = "Username is required";
    }
    if (!accountData.email.trim()) {
      errors.email = "Email is required";
    }
    if (!accountData.password.trim()) {
      errors.password = "Password is required";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // e.target is correctly typed as HTMLInputElement
    const { value } = e.target;

    setConfirmPassword(value);

    if (value !== accountData.password) {
      setMatchError(true);
    } else {
      setMatchError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateData()) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/create-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accountData), // Send the actual formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setAccountData({
        fullName: "",
        username: "",
        email: "",
        password: "",
      });
      setConfirmPassword("");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Account information submission error:", error);
    }
  };

  return (
    <div className="container">
      <div className="backdrop"></div>

      <div className="card">
        <div className="header">
          <div className="logo-container">
            <MessageCircle className="logo-icon" />
          </div>
          <h1 className="app-title">CometChat</h1>
          <p className="app-subtitle">Connect across the cosmos</p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="full-name">
              Full Name
            </label>
            <input
              name="fullName"
              value={accountData.fullName}
              onChange={handleInputChange}
              type="text"
              className={`form-input ${errors.fullName ? "error" : ""}`}
              id="full-name"
              placeholder="Enter full name"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Username
            </label>
            <input
              name="username"
              value={accountData.username}
              onChange={handleInputChange}
              type="text"
              className={`form-input ${errors.username ? "error" : ""}`}
              id="username"
              placeholder="Enter your username"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              name="email"
              value={accountData.email}
              onChange={handleInputChange}
              type="email"
              className={`form-input ${errors.email ? "error" : ""}`}
              id="email"
              placeholder="Enter email"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="password-input-wrapper">
              <input
                name="password"
                value={accountData.password}
                onChange={handleInputChange}
                type={`${hidePassword ? "password" : "text"}`}
                className={`form-input ${errors.password ? "error" : ""}`}
                id="password"
                placeholder="Enter password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setHidePassword((prev) => !prev)}
              >
                {hidePassword ? (
                  <EyeOff className="toggle-icon" />
                ) : (
                  <Eye className="toggle-icon" />
                )}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="confirm-password">
              Confirm Password
            </label>
            <div className="password-input-wrapper">
              <span className={matchError ? "match-error-message" : "hide"}>
                Passwords must match
              </span>
              <input
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                type={`${hidePassword ? "password" : "text"}`}
                className={`${matchError ? "error" : "form-input"}`}
                id="confirm-password"
                placeholder="Reenter password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setHidePassword((prev) => !prev)}
              >
                {hidePassword ? (
                  <EyeOff className="toggle-icon" />
                ) : (
                  <Eye className="toggle-icon" />
                )}
              </button>
            </div>
          </div>
          <div className="form-options">
            <label className="checkbox-wrapper">
              <input type="checkbox" className="checkbox-input" />
              <span className="checkbox-label">Remember me</span>
            </label>
            <button type="button" className="forgot-password">
              Forgot password?
            </button>
          </div>

          <Button type="submit" children={"Launch"} />
        </form>

        {/* Divider */}
        <div className="divider">
          <div className="divider-line"></div>
          <span className="divider-text">or</span>
          <div className="divider-line"></div>
        </div>

        {/* Sign up link */}
        <p className="login-text">
          Already a user?{" "}
          <button className="login-link">
            <Link to={"/login"} className="login-link">
              Login
            </Link>
          </button>
        </p>
      </div>
    </div>
  );
};

export default CreateAccount;
