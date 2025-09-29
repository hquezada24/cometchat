// CometChat.jsx
import { useState } from "react";
import { MoreVertical, Phone, Video, Send } from "lucide-react";
import SideBar from "../../components/SideBar/SideBar";
import "./Home.css";

const CometChat = () => {
  const [selectedChat, setSelectedChat] = useState(0);
  const [message, setMessage] = useState("");

  const chats = [
    {
      id: 1,
      name: "Sarah Chen",
      lastMessage: "Hey! How's the project going?",
      time: "2m",
      unread: 3,
      avatar: "SC",
      online: true,
    },
    {
      id: 2,
      name: "Dev Team",
      lastMessage: "Alex: New deployment is ready",
      time: "15m",
      unread: 0,
      avatar: "DT",
      online: false,
      isGroup: true,
    },
    {
      id: 3,
      name: "Maya Rodriguez",
      lastMessage: "Thanks for the help earlier!",
      time: "1h",
      unread: 1,
      avatar: "MR",
      online: true,
    },
  ];

  const messages = [
    {
      id: 1,
      text: "Hey! How's the project going?",
      sender: "them",
      time: "2:30 PM",
    },
    {
      id: 2,
      text: "Pretty good! Just finished the user authentication flow",
      sender: "me",
      time: "2:32 PM",
    },
    {
      id: 3,
      text: "That's awesome! Any challenges with the backend integration?",
      sender: "them",
      time: "2:33 PM",
    },
    {
      id: 4,
      text: "Not really, the API is well documented. Should have it deployed by tomorrow",
      sender: "me",
      time: "2:35 PM",
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <SideBar />

      {/* Chat Area */}
      <div className="chat-area">
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-header-content">
            <div className="chat-header-left">
              <div className="avatar-container">
                <div className="chat-header-avatar">
                  {chats[selectedChat].avatar}
                </div>
                {chats[selectedChat].online && (
                  <div className="online-indicator"></div>
                )}
              </div>
              <div className="chat-header-info">
                <h2 className="chat-header-name">{chats[selectedChat].name}</h2>
                <p className="chat-header-status">
                  {chats[selectedChat].online ? "Online" : "Last seen 2h ago"}
                </p>
              </div>
            </div>

            <div className="chat-header-right">
              <button className="chat-header-button">
                <Phone size={20} />
              </button>
              <button className="chat-header-button">
                <Video size={20} />
              </button>
              <button className="chat-header-button">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="messages-container">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message-row ${
                msg.sender === "me" ? "message-row-me" : "message-row-them"
              }`}
            >
              <div
                className={`message-bubble ${
                  msg.sender === "me"
                    ? "message-bubble-me"
                    : "message-bubble-them"
                }`}
              >
                <p className="message-text">{msg.text}</p>
                <p className="message-time">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="input-area">
          <div className="input-container">
            <div className="input-wrapper">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="message-input"
              />
            </div>
            <button onClick={handleSendMessage} className="send-button">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CometChat;
