// src/components/SideBar/SideBar.tsx
import { useState, useRef, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  Menu,
  MessageCircle,
  MessageCirclePlus,
  ArrowLeft,
} from "lucide-react";
import { debounce } from "lodash";
import { searchUsers, fetchChatRooms } from "../../services/apiServices";
import "./SideBar.css";
import useAuth from "../../context/useAuth";
import ChatItem from "../ChatItem/ChatItem";
// import { createTemporaryChat } from "../../types/chatTypes";

const SideBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchContact, setSearchContact] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();
  const { logout, user, selectedChat, setSelectedChat, isLoading } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeChats, setActiveChats] = useState([]);
  const [temporaryChat, setTemporaryChat] = useState(null);
  const [error, setError] = useState(null);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (searchQuery) => {
        if (searchQuery.trim().length < 2) {
          setResults([]);
          setLoading(false);
          return;
        }

        setLoading(true);
        try {
          const data = await searchUsers(searchQuery);
          setResults(data.data || []);
        } catch (error) {
          console.error("Search error:", error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      }, 400),
    []
  );

  useEffect(() => {
    debouncedSearch(query);
    return () => {
      debouncedSearch.cancel();
    };
  }, [query, debouncedSearch]);

  // Fetch chat rooms on mount
  useEffect(() => {
    const loadChatRooms = async () => {
      const uid = user?.id || user?._id;
      if (!uid) return;

      try {
        setLoading(true);
        const chats = await fetchChatRooms(uid);
        console.log("Fetched chat rooms:", chats);
        setActiveChats(Array.isArray(chats) ? chats : []);
        if (Array.isArray(chats) && chats.length > 0 && !selectedChat) {
          setSelectedChat(chats[0]);
        }
      } catch (err) {
        console.error("Error fetching chat rooms:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadChatRooms();
  }, [user?.id, user?._id]);

  // Handle contact click from search results
  const handleContactClick = (contact) => {
    const existingChat = activeChats.find((chat) =>
      chat.users.some((u) => {
        const uid = String(u.id ?? u._id ?? u.userId ?? "");
        const contactId = String(
          contact.id ?? contact._id ?? contact.userId ?? ""
        );
        return uid && contactId && uid === contactId;
      })
    );

    if (existingChat) {
      setSelectedChat(existingChat);
      setTemporaryChat(null);
      setSearchContact(false);
      setQuery("");
    } else {
      const tempChat = {
        id: `temp-${contact.id ?? contact._id}`,
        users: [user, contact],
        messages: [],
        isTemporary: true,
        otherUser: contact,
      };

      setTemporaryChat(tempChat);
      setSelectedChat(tempChat);
      setSearchContact(false);
      setQuery("");
    }
  };

  // Combine active chats with temporary chat
  const displayedChats = temporaryChat
    ? [temporaryChat, ...activeChats]
    : activeChats;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigationItems = [{ path: "/profile", label: "My Profile" }];

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    await logout();
  };

  const selectChat = (chatRoom) => {
    setSelectedChat(chatRoom);
  };

  if (error && activeChats.length === 0) {
    return <div className="sidebar">Error: {error}</div>;
  }

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div className="sidebar-container">
      <div
        className={`sidebar original ${
          searchContact ? "slide-out" : "slide-in"
        }`}
      >
        {/* Header */}
        <div className="sidebar-header">
          <div className="header-top">
            <div className="brand-container">
              <div className="logo">
                <MessageCircle size={16} color="white" />
              </div>
              <h1 className="title">Comet Chat</h1>
            </div>

            <div className="header-options">
              <button
                className="new-conversation"
                onClick={() => setSearchContact(true)}
              >
                <MessageCirclePlus size={20} />
              </button>

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
                    <li
                      key={"logout"}
                      className="mobileNavItem"
                      onClick={handleLogout}
                    >
                      <p className={`mobileNavLink logout`}>Log out</p>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>

          {/* Search conversations */}
          <div className="search-container">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="search-input"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="chat-list">
          {loading && activeChats.length === 0 ? (
            <div className="loading-state">Loading chats...</div>
          ) : displayedChats.length === 0 ? (
            <div className="empty-state">No conversations yet</div>
          ) : (
            displayedChats.map((chat) => (
              <ChatItem
                chat={chat}
                key={chat.id}
                currentUserId={user?.id || ""}
                selected={selectedChat?.id === chat.id}
                onClick={() => selectChat(chat)}
              />
            ))
          )}
        </div>
      </div>

      {/* Search Contact Panel */}
      <div
        className={`search-contact ${searchContact ? "slide-in" : "slide-out"}`}
      >
        <div className="search-contact-header">
          <button
            className="return-to-sidebar"
            onClick={() => {
              setSearchContact(false);
              setQuery("");
              setResults([]);
            }}
          >
            <ArrowLeft size={20} />
          </button>
        </div>
        <div className="search-container">
          <Search size={16} className="search-contact-icon" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a name or a username"
            className="search-input"
          />
        </div>
        <div className="search-results">
          {loading ? (
            <div className="loading-state">Loading...</div>
          ) : results.length > 0 ? (
            results.map((searchUser) => (
              <div
                key={searchUser.id}
                className="search-item"
                onClick={() => handleContactClick(searchUser)}
                style={{ cursor: "pointer" }}
              >
                <div className="search-item-content">
                  <div className="search-info">
                    <div className="avatar-container">
                      <div className="avatar avatar-regular">
                        {searchUser.fullName.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="search-details">
                      <div className="search-header">
                        <h3 className="search-name">{searchUser.fullName}</h3>
                      </div>
                      <div className="username">
                        <p>{`@${searchUser.username}`}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : query.length > 0 ? (
            <div className="empty-state">No users found.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
