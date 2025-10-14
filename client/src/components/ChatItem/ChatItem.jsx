import "./ChatItem.css";
import useTheme from "../../hooks/useTheme";

const ChatItem = ({ chat, currentUserId, onClick, selected = false }) => {
  const otherUser = chat.users.find(
    (u) => String(u.id ?? u._id) !== String(currentUserId)
  );
  const { theme } = useTheme();
  const displayName = otherUser?.fullName || "Unknown User";
  const displayUsername = otherUser?.username || "";
  const avatarInitial = (displayName.charAt(0) || "?").toUpperCase();

  const lastMessage =
    chat.messages && chat.messages.length > 0
      ? chat.messages[chat.messages.length - 1]?.content ||
        chat.messages[chat.messages.length - 1]?.text ||
        ""
      : chat.isTemporary
      ? "Start a conversation..."
      : "No messages yet";

  return (
    <div
      key={chat.id}
      className={`chat-item ${selected ? "chat-item-active" : ""}`}
      data-theme={theme === "dark" ? "dark" : ""}
      onClick={onClick}
    >
      <div className="chat-item-content">
        <div className="chat-info">
          <div className="avatar-container">
            <div className={`avatar avatar-regular`}>{avatarInitial}</div>
            {chat.online && <div className="online-indicator"></div>}
          </div>
          <div
            className="chat-details"
            data-theme={theme === "dark" ? "dark" : ""}
          >
            <div className="chat-header">
              <h3
                className={`chat-name ${selected ? "chat-name-active" : ""}`}
                data-theme={theme === "dark" ? "dark" : ""}
              >
                {displayName}
              </h3>
              <span>{`@${displayUsername}`}</span>
            </div>
            <div className="chat-footer">
              <p
                className={`last-message ${
                  chat.isTemporary ? "temporary-chat" : ""
                }`}
              >
                {lastMessage}
              </p>
              {chat.unread > 0 && (
                <span className="unread-badge">{chat.unread}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
