import "./Profile.css";
import { ArrowLeft, Pencil, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { updateProfile } from "../../services/userService";
import useAuth from "../../context/useAuth";

const ChatProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState(user.email);
  const [username, setUsername] = useState(user.username);
  const [fullName, setFullName] = useState(user.fullName);

  // helper to detect changes
  const getUpdatedFields = () => {
    const updates = {};
    if (fullName !== user.fullName) updates.fullName = fullName;
    if (username !== user.username) updates.username = username;
    if (email !== user.email) updates.email = email;
    return updates;
  };

  const handleSubmit = async () => {
    const updates = getUpdatedFields();
    if (Object.keys(updates).length === 0) {
      setIsEditing(false);
      return;
    }

    try {
      const updatedUser = await updateProfile(updates);
      console.log("Profile updated:", updatedUser);
      setIsEditing(false);
    } catch (err) {
      // show toast or inline error
    }
  };

  return (
    <div className="profile">
      <div className="profile-container">
        <div className="profile-header">
          <div className="return">
            <Link className="return-button" to={"/"}>
              <ArrowLeft size={20} />
            </Link>
          </div>
          <div className="avatar-container">
            <div className="avatar">
              {user ? user.fullName.charAt(0).toUpperCase() : ""}
            </div>
          </div>
          {isEditing ? (
            <div className="profile-field">
              <label htmlFor="fullName" className="input-label">
                Name
              </label>
              <input
                value={fullName}
                id="fullName"
                name="fullName"
                className="header-input"
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          ) : (
            <h1 className="profile-name">{fullName}</h1>
          )}
          {isEditing ? (
            <div className="profile-field">
              <label htmlFor="username" className="input-label">
                Username
              </label>
              <input
                value={username}
                id="username"
                name="username"
                onChange={(e) => setUsername(e.target.value)}
                className="header-input"
              />
            </div>
          ) : (
            <p className="profile-username">@{username}</p>
          )}

          <div className="edit-button-container">
            {isEditing ? (
              <button className="edit-button" onClick={handleSubmit}>
                Save
                <Check />
              </button>
            ) : (
              <button
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                Edit Info
                <Pencil />
              </button>
            )}
          </div>
        </div>

        <div className="profile-body">
          <div className="info-grid">
            <div className="info-item">
              {isEditing ? (
                <input
                  value={email}
                  id="email"
                  name="email"
                  className="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              ) : (
                <div className="info-value">{email}</div>
              )}
              <div className="info-label">Email</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatProfile;
