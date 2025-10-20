import "./MessageBubble.css";
import useTheme from "../../hooks/useTheme";
import Navigation from "../Navigation/Navigation";
import { ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";

const navigationItems = [{ label: "Edit" }, { label: "Delete" }];

const MessageBubble = ({
  messageRow,
  messageBubble,
  onClick,
  isMenuOpen,
  navClassName,
  message,
  date,
}) => {
  const { theme } = useTheme();
  const location = useLocation;

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`message-row ${messageRow}`}>
      <div
        className={`message-bubble ${messageBubble}`}
        data-theme={theme === "dark" ? "dark" : ""}
      >
        <div className="nav-container">
          <div className="button-container">
            <button
              className="options slide-button"
              data-theme={theme === "dark" ? "dark" : ""}
              onClick={onClick}
            >
              <ChevronDown size={30} />
            </button>
          </div>
          <Navigation
            navigationItems={navigationItems}
            isMenuOpen={isMenuOpen}
            isActiveLink={isActiveLink}
            className={`${navClassName}`}
          />
        </div>
        <p className="message-text">{message}</p>
        <p className="message-time">
          {new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
