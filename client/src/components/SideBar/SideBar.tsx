import { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  Menu,
  MessageCircle,
  MessageCirclePlus,
  ArrowLeft,
} from "lucide-react";
import "./SideBar.css";

const SideBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(0);
  const [searchContact, setSearchContact] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigationItems = [{ path: "/profile", label: "My Profile" }];

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="chat-container">
      <div className="sidebar-container">
        <div
          className={`sidebar original ${
            searchContact ? "slide-out" : "slide-in"
          }`}
        >
          {/* Header */}
          <div className="sidebar-header">
            <div className="header-top">
              {/* Logo on the left */}
              <div className="brand-container">
                <div className="logo">
                  <MessageCircle size={16} color="white" />
                </div>
                <h1 className="title">Comet Chat</h1>
              </div>

              {/* Buttons on the right */}
              <div className="header-options">
                <button
                  className="new-conversation"
                  onClick={() => setSearchContact(true)}
                >
                  <MessageCirclePlus size={20} />
                </button>

                {/* Mobile Menu Button */}
                <div className="mobileMenu" ref={menuRef}>
                  <button
                    className="menuButton"
                    onClick={toggleMenu}
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-navigation"
                    aria-label="Toggle navigation menu"
                  >
                    <Menu size={20} />
                  </button>

                  {/* Mobile Navigation Dropdown */}
                  <nav
                    className={`mobileNav ${isMenuOpen ? "mobileNavOpen" : ""}`}
                    id="mobile-navigation"
                    aria-label="Mobile navigation"
                  >
                    <ul className="mobileNavList">
                      {navigationItems.map((item) => (
                        <li key={item.path} className="mobileNavItem">
                          <Link
                            to={item.path}
                            className={`mobileNavLink ${
                              isActiveLink(item.path) ? "activeMobileLink" : ""
                            }`}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </div>
            </div>

            {/* Search under the buttons */}
            <div className="search-container">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="search-input"
              />
            </div>

            <div className="chat-list">
              {chats.map((chat, index) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(index)}
                  className={`chat-item ${
                    selectedChat === index ? "chat-item-active" : ""
                  }`}
                >
                  <div className="chat-item-content">
                    <div className="chat-info">
                      <div className="avatar-container">
                        <div
                          className={`avatar ${
                            chat.isGroup ? "avatar-group" : "avatar-regular"
                          }`}
                        >
                          {chat.avatar}
                        </div>
                        {chat.online && (
                          <div className="online-indicator"></div>
                        )}
                      </div>
                      <div className="chat-details">
                        <div className="chat-header">
                          <h3
                            className={`chat-name ${
                              selectedChat === index ? "chat-name-active" : ""
                            }`}
                          >
                            {chat.name}
                          </h3>
                          <span className="chat-time">{chat.time}</span>
                        </div>
                        <div className="chat-footer">
                          <p className="last-message">{chat.lastMessage}</p>
                          {chat.unread > 0 && (
                            <span className="unread-badge">{chat.unread}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`search-contact ${
              searchContact ? "slide-in" : "slide-out"
            }`}
          >
            <div className="search-contact-header">
              <button
                className="return-to-sidebar"
                onClick={() => setSearchContact(false)}
              >
                <ArrowLeft size={20} />
              </button>
            </div>
            <div>
              <Search size={16} className="search-contact-icon" />
              <input
                type="text"
                placeholder="Search a name or a username"
                className="search-input"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
