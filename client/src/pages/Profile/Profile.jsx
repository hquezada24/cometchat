import "./Profile.css";
import { ArrowLeft, Pencil, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  updateProfile,
  checkUsername,
  checkEmail,
} from "../../services/userService";
import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";

const ChatProfile = () => {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState(user.email);
  const [username, setUsername] = useState(user.username);
  const [fullName, setFullName] = useState(user.fullName);
  const [isValid, setIsValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [emailResult, setEmailResult] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!isEditing) return; // only run validation when editing

    if (username.length < 3) {
      setIsValid(false);
      setResult(null);
      return;
    }

    setIsValid(true);

    const controller = new AbortController(); // for cancellation
    const handler = setTimeout(async () => {
      setLoading(true);
      setResult(null);

      try {
        const data = await checkUsername(username);
        setResult(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setResult("⚠️ Error checking username");
        }
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      clearTimeout(handler); // cleanup debounce
      controller.abort(); // cancel fetch if still in flight
    };
  }, [username]);

  useEffect(() => {
    if (!isEditing) return; // only run validation when editing

    setIsValid(true);

    const controller = new AbortController(); // for cancellation
    const handler = setTimeout(async () => {
      setLoading(true);
      setEmailResult(null);

      try {
        const data = await checkEmail(email);
        setEmailResult(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setEmailResult("⚠️ Error checking username");
        }
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      clearTimeout(handler); // cleanup debounce
      controller.abort(); // cancel fetch if still in flight
    };
  }, [email]);

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
      await updateProfile(updates);
      await refreshUser();
      setIsEditing(false);
    } catch (err) {
      console.error("Profile information submission error:", err);
    }
  };

  const handleReset = () => {
    setFullName(user.fullName);
    setUsername(user.username);
    setEmail(user.email);
    setResult(null);
    setEmailResult(null);
    setIsEditing(false);
  };

  return (
    <div className="profile">
      <div className="profile-container">
        <div
          className="profile-header"
          data-theme={theme === "dark" ? "dark" : ""}
        >
          <div className="return" data-theme={theme === "dark" ? "dark" : ""}>
            <Link
              className="return-button"
              to={"/"}
              data-theme={theme === "dark" ? "dark" : ""}
            >
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
                data-theme={theme === "dark" ? "dark" : ""}
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

              {isValid ? null : (
                <span className="valid">
                  Must be at least 3 characters long
                </span>
              )}
              {!loading && result ? (
                result.sameAsCurrent ? null : result.available ? null : (
                  <span className="not-available">{result.message}</span>
                )
              ) : null}

              <input
                value={username}
                id="username"
                name="username"
                onChange={(e) => setUsername(e.target.value)}
                className="header-input"
                data-theme={theme === "dark" ? "dark" : ""}
              />
            </div>
          ) : (
            <p className="profile-username">@{username}</p>
          )}

          <div className="edit-button-container">
            {isEditing ? (
              <>
                <button
                  className="edit-button"
                  onClick={handleSubmit}
                  disabled={
                    result?.available === false ||
                    emailResult?.available === false
                  }
                  data-theme={theme === "dark" ? "dark" : ""}
                >
                  <Check />
                </button>
                <button
                  className="edit-button margin-left"
                  onClick={handleReset}
                >
                  <X />
                </button>
              </>
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

        <div
          className="profile-body"
          data-theme={theme === "dark" ? "dark" : ""}
        >
          <div className="info-grid">
            <div
              className="info-item"
              data-theme={theme === "dark" ? "dark" : ""}
            >
              {isEditing ? (
                <div className="email-field">
                  {!loading && emailResult ? (
                    emailResult.sameAsCurrent ? null : emailResult.available ? null : (
                      <span className="not-available">
                        {emailResult.message}
                      </span>
                    )
                  ) : null}
                  <input
                    value={email}
                    id="email"
                    name="email"
                    className="email"
                    data-theme={theme === "dark" ? "dark" : ""}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              ) : (
                <div
                  className="info-value"
                  data-theme={theme === "dark" ? "dark" : ""}
                >
                  {email}
                </div>
              )}
              <div
                className="info-label"
                data-theme={theme === "dark" ? "dark" : ""}
              >
                Email
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatProfile;
