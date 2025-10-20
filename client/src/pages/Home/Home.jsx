import { useEffect, useState } from "react";
import { MoreVertical, Send, MessageCircle } from "lucide-react";
import SideBar from "../../components/SideBar/SideBar";
import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";
import { sendMessage } from "../../services/apiServices";
import MessageBubble from "../../components/MessageBubble/MessageBubble";
import "./Home.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const Home = () => {
  const [message, setMessage] = useState("");
  const { selectedChat, setSelectedChat, user } = useAuth();
  const [otherUser, setOtherUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [displayUsername, setDisplayUsername] = useState("");
  const [avatarInitial, setAvatarInitial] = useState("");
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const { theme } = useTheme();
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    if (!selectedChat || !user) return;

    const other = selectedChat.users.find((chatMember) => {
      const cmId = String(chatMember.id ?? chatMember._id ?? "");
      const uId = String(user.id ?? user._id ?? "");
      return cmId && uId && cmId !== uId;
    });

    setOtherUser(other);
    setDisplayName(other?.fullName || "Unknown User");
    setDisplayUsername(other?.username || "");
    setAvatarInitial((other?.fullName?.charAt(0) || "?").toUpperCase());

    setMessages(selectedChat.messages || []);
  }, [selectedChat, user]);

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat || !user) return;

    const messageContent = message.trim();
    setMessage("");
    setIsSending(true);

    try {
      console.log("Selected chat: ", selectedChat);
      if (selectedChat.isTemporary) {
        // inside handleSendMessage when selectedChat.isTemporary
        const otherUserId =
          selectedChat.otherUser?.id ?? selectedChat.otherUser?._id;
        if (!otherUserId) throw new Error("Recipient id not available");

        console.log(
          "Sending create chat. selectedChat.otherUser:",
          selectedChat.otherUser,
          "current user:",
          user
        );

        const response = await fetch(`${API_BASE_URL}/api/chatrooms`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            otherUserId,
            message: messageContent,
          }),
        });

        if (!response.ok) throw new Error("Failed to create chat room");

        const newChatRoom = await response.json();

        setSelectedChat(newChatRoom);
      } else {
        const newMessage = await sendMessage(selectedChat.id, messageContent);

        setMessages((prev) => [...prev, newMessage]);

        setSelectedChat({
          ...selectedChat,
          messages: [...(selectedChat.messages || []), newMessage],
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
      setMessage(messageContent);
    } finally {
      setIsSending(false);
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};

    messages.forEach((msg) => {
      const date = new Date(msg.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });

    return groups;
  };

  const formatDateLabel = (dateString) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const msgDate = new Date(dateString.split(",")[0]); // Parse the date part

    if (msgDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (msgDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return dateString;
  };

  const toggleMenu = (messageId) => {
    setOpenMenuId(openMenuId === messageId ? null : messageId);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!selectedChat) {
    return (
      <div className="chat-container">
        <SideBar />
        <div className="chat-area">
          <div className="empty-chat-state">
            <MessageCircle size={64} color="#ccc" />
            <h2>Select a conversation to start chatting</h2>
            <p>Choose a conversation from the sidebar or start a new one</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <SideBar />

      <div className="chat-area" data-theme={theme === "dark" ? "dark" : ""}>
        {/* header */}
        <div
          className="chat-header"
          data-theme={theme === "dark" ? "dark" : ""}
        >
          <div className="chat-header-content">
            <div className="chat-header-left">
              <div className="avatar-container">
                <div className="chat-header-avatar">{avatarInitial}</div>
              </div>
              <div className="chat-header-info">
                <h2
                  className="chat-header-name"
                  data-theme={theme === "dark" ? "dark" : ""}
                >
                  {displayName}
                </h2>
                <p
                  className="chat-header-username"
                  data-theme={theme === "dark" ? "dark" : ""}
                >
                  @{displayUsername}
                </p>
              </div>
            </div>

            <div className="chat-header-right">
              <button
                className="chat-header-button"
                title="More options"
                data-theme={theme === "dark" ? "dark" : ""}
              >
                <MoreVertical size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* messages */}
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="empty-messages-state">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            Object.entries(groupMessagesByDate(messages)).map(
              ([date, msgs]) => (
                <div key={date}>
                  <div className="date-divider">
                    <span>{formatDateLabel(date)}</span>
                  </div>
                  {msgs.map((msg) => (
                    <>
                      <MessageBubble
                        key={msg.id}
                        messageRow={
                          String(msg.senderId ?? msg.sender?._id) ===
                          String(user?.id ?? user?._id)
                            ? "message-row-me"
                            : "message-row-them"
                        }
                        messageBubble={
                          String(msg.senderId ?? msg.sender?._id) ===
                          String(user?.id ?? user?._id)
                            ? "message-bubble-me"
                            : "message-bubble-them"
                        }
                        onClick={() => toggleMenu(msg.id)}
                        isMenuOpen={openMenuId === msg.id}
                        navClassName={
                          String(msg.senderId ?? msg.sender?._id) ===
                          String(user?.id ?? user?._id)
                            ? "right"
                            : "left"
                        }
                        message={msg.content}
                        date={msg.createdAt}
                      />
                    </>
                  ))}
                </div>
              )
            )
          )}
        </div>

        {/* input */}
        <div className="input-area" data-theme={theme === "dark" ? "dark" : ""}>
          <div className="input-container">
            <div className="input-wrapper">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="message-input"
                disabled={isSending}
                data-theme={theme === "dark" ? "dark" : ""}
              />
            </div>
            <button
              onClick={handleSendMessage}
              className="send-button"
              disabled={!message.trim() || isSending}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
