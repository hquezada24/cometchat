// import React, { useState } from "react";
import "./Profile.css";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ChatProfile = () => {
  const profileData = {
    name: "Alberto",
    username: "@alberto",
    avatar: "al",
    joinDate: "March 2023",
  };

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
            <div className="avatar">{profileData.avatar}</div>
          </div>
          <h1 className="profile-name">{profileData.name}</h1>
          <p className="profile-username">{profileData.username}</p>
        </div>

        <div className="profile-body">
          <div className="info-grid">
            <div className="info-item">
              <div className="info-value">{profileData.joinDate}</div>
              <div className="info-label">Joined</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatProfile;
