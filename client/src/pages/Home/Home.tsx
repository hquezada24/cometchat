// src/pages/Home/Home.tsx
import { useEffect, useState } from "react";
import { MoreVertical, Phone, Video, Send, MessageCircle } from "lucide-react";
import SideBar from "../../components/SideBar/SideBar";
import useAuth from "../../context/useAuth";
import { sendMessage } from "../../services/apiServices";
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

  // Update other user info when selectedChat changes
  useEffect(() => {
    if (!selectedChat || !user) return;

    const other = selectedChat.users.find(
      (chatMember) => chatMember.id !== user.id
    );

    setOtherUser(other);
    setDisplayName(other?.fullName || "Unknown User");
    setDisplayUsername(other?.username || "");
    setAvatarInitial(other?.fullName?.charAt(0).toUpperCase() || "?");

    // Load existing messages
    setMessages(selectedChat.messages || []);
  }, [selectedChat, user]);

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat || !user) return;

    const messageContent = message.trim();
    setMessage("");
    setIsSending(true);

    try {
      // Handle temporary chat - create chat room first
      if (selectedChat.isTemporary) {
        const response = await fetch(`${API_BASE_URL}/api/chatrooms`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            participantId: otherUser.id,
            message: messageContent,
          }),
        });

        if (!response.ok) throw new Error("Failed to create chat room");

        const newChatRoom = await response.json();

        // Update selectedChat to the new permanent chat
        setSelectedChat(newChatRoom);

        // The parent component (SideBar) should refresh chat list
        // You might want to add a callback or event for this
      } else {
        // Send message to existing chat
        const newMessage = await sendMessage(selectedChat.id, messageContent);

        // Update messages locally
        setMessages((prev) => [...prev, newMessage]);

        // Update the chat in selectedChat
        setSelectedChat({
          ...selectedChat,
          messages: [...(selectedChat.messages || []), newMessage],
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
      // Restore message if failed
      setMessage(messageContent);
    } finally {
      setIsSending(false);
    }
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

      <div className="chat-area">
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-header-content">
            <div className="chat-header-left">
              <div className="avatar-container">
                <div className="chat-header-avatar">{avatarInitial}</div>
              </div>
              <div className="chat-header-info">
                <h2 className="chat-header-name">{displayName}</h2>
                <p className="chat-header-status">@{displayUsername}</p>
              </div>
            </div>

            <div className="chat-header-right">
              <button className="chat-header-button" title="Voice call">
                <Phone size={20} />
              </button>
              <button className="chat-header-button" title="Video call">
                <Video size={20} />
              </button>
              <button className="chat-header-button" title="More options">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="empty-messages-state">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`message-row ${
                  msg.senderId === user?.id
                    ? "message-row-me"
                    : "message-row-them"
                }`}
              >
                <div
                  className={`message-bubble ${
                    msg.senderId === user?.id
                      ? "message-bubble-me"
                      : "message-bubble-them"
                  }`}
                >
                  <p className="message-text">{msg.content || msg.text}</p>
                  <p className="message-time">
                    {msg.time || new Date(msg.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="input-area">
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
