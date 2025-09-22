import "./CreateAccount.css";
import Button from "../Button/Button";
import { MessageCircle } from "lucide-react";

const CreateAccount = () => {
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

        <form className="form">
          <div className="form-group">
            <label className="form-label" htmlFor="full-name">
              Full Name
            </label>
            <input
              type="text"
              className="form-input"
              id="full-name"
              placeholder="Enter full name"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              className="form-input"
              id="username"
              placeholder="Enter your username"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              className="form-input"
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
                type="password"
                className="form-input"
                id="password"
                placeholder="Enter password"
              />
              <button type="button" className="password-toggle">
                {/* {showPassword ? (
                  <EyeOff className={styles.toggleIcon} />
                ) : (
                  <Eye className={styles.toggleIcon} />
                )} */}
                See
              </button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="confirm-password">
              Confirm Password
            </label>
            <div className="password-input-wrapper">
              <input
                type="password"
                className="form-input"
                id="confirm-password"
                placeholder="Reenter password"
              />
              <button type="button" className="password-toggle">
                {/* {showPassword ? (
                  <EyeOff className={styles.toggleIcon} />
                ) : (
                  <Eye className={styles.toggleIcon} />
                )} */}
                See
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
          Already a star? <button className="login-link">Login</button>
        </p>
      </div>
    </div>
  );
};

export default CreateAccount;
