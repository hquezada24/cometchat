import "./Profile.css";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "../../context/useAuth";

const ChatProfile = () => {
  const { user } = useAuth();

  return (
    <div className="profile">
      <div className="profile-container">
        <div className="profile-header">
          <div className="return">
            <button className="return-button">
              <Link to={"/"}>
                <ArrowLeft size={20} />
              </Link>
            </button>
          </div>
          <div className="avatar-container">
            <div className="avatar">{user ? user.fullName : ""}</div>
          </div>
          <h1 className="profile-name">{user ? user.fullName : ""}</h1>
          <p className="profile-username">{user ? `@${user.username}` : ""}</p>
        </div>

        <div className="profile-body">
          <div className="info-grid">
            <div className="info-item">
              <div className="info-value">{user ? user.email : ""}</div>
              <div className="info-label">Email</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatProfile;
