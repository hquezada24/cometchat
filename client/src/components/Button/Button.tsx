import type { JSX } from "react";
import styles from "./Button.module.css";
import { Link } from "react-router-dom";

type ButtonType = "button" | "submit" | "reset";

interface ButtonProps {
  children: string | JSX.Element;
  link?: string;
  type?: ButtonType;
  disabled?: boolean;
}

const Button = ({ children, link, type, disabled }: ButtonProps) => {
  return (
    <button
      className={`${styles.loginButton} ${disabled ? styles.loading : ""}`}
      type={type}
      disabled={disabled}
    >
      {link ? (
        <Link to={link} className={styles.link}>
          {disabled ? (
            <div className={styles.loadingContent}>
              <div className={styles.loadingSpinner}></div>
              Launching...
            </div>
          ) : typeof children === "string" ? (
            <span className={styles.span}>{children}</span>
          ) : (
            children
          )}
        </Link>
      ) : disabled ? (
        <div className={styles.loadingContent}>
          <div className={styles.loadingSpinner}></div>
          Launching...
        </div>
      ) : typeof children === "string" ? (
        <span className={styles.span}>{children}</span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
