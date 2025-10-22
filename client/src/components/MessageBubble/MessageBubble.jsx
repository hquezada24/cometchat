import "./MessageBubble.css";
import useTheme from "../../hooks/useTheme";
import Navigation from "../Navigation/Navigation";
import { modifyMessage, deleteMessage } from "../../services/apiServices";
import { ChevronDown, Check, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import useAuth from "../../hooks/useAuth";

const MessageBubble = ({
  messageRow,
  messageBubble,
  onClick,
  isMenuOpen,
  message,
  messageId,
  date,
  onDeleteLocal,
}) => {
  const { theme } = useTheme();
  const [editMessage, setEditMessage] = useState(false);
  const [messageValue, setMessageValue] = useState(message);
  const [msgId, setMessageId] = useState(messageId);
  const location = useLocation();
  const { selectedChat } = useAuth();
  const textareaRef = useRef(null);

  const navigationItems = [
    { label: "Edit", onClick: () => setEditMessage(true) },
    { label: "Delete", onClick: () => handleDelete() },
  ];
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const handleEditSubmit = async () => {
    try {
      await modifyMessage(selectedChat.id, messageValue, msgId);
    } catch (error) {
      console.error("Failed to modify message: ", error);
    }
  };
  const handleDelete = async () => {
    try {
      await deleteMessage(selectedChat.id, msgId);

      onDeleteLocal(msgId);
    } catch (error) {
      console.error("Failed to delete message: ", error);
    }
  };

  const handleReset = async () => {
    setMessageValue(message);
    setEditMessage(false);
  };

  useEffect(() => {
    if (editMessage && textareaRef.current) {
      const el = textareaRef.current;
      el.focus();
      el.selectionStart = el.selectionEnd = el.value.length;
    }
  }, [editMessage]);

  return (
    <div className={`message-row ${messageRow}`}>
      <div
        className={`message-bubble ${messageBubble}`}
        data-theme={theme === "dark" ? "dark" : ""}
      >
        {editMessage ? null : (
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
            />
          </div>
        )}
        {editMessage ? (
          <form className="edit-message-form" onSubmit={handleEditSubmit}>
            <textarea
              ref={textareaRef}
              id="message-textarea"
              name="message"
              rows={`${Math.min(10, Math.ceil(messageValue.length / 50))}`}
              cols="50"
              wrap="soft"
              data-theme={theme === "dark" ? "dark" : ""}
              value={messageValue}
              onChange={(e) => {
                if (e.target.value.length <= 1000)
                  setMessageValue(e.target.value);
              }}
            ></textarea>

            <div className="edit-message-buttons">
              <button type="submit" className="done">
                <Check size={15} />
              </button>
              <button className="done" onClick={handleReset}>
                <X size={15} />
              </button>
            </div>
          </form>
        ) : (
          <p className="message-text">{message}</p>
        )}
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
