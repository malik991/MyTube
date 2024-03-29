// src/SidePanel.js
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import { LogOutBtn } from "./index";

const SidePanel = () => {
  const userData = useSelector((state) => state.auth.userData);
  const [profileImage, setProfileImage] = useState();
  useEffect(() => {
    if (userData?.avatar) {
      setProfileImage(userData.avatar);
    }
  }, []);

  return (
    <div className="side-panel flex flex-col justify-between h-screen bg-customBlue p-4 text-white">
      {profileImage && (
        <div className="m-4 p-2 content-center">
          <Avatar src={profileImage} sx={{ width: 90, height: 90 }} />
        </div>
      )}

      <ul>
        <li className="mb-2 p-2 text-xl text-black font-bold font-sans border-b-2 border-cyan-200">
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li className="mb-2 p-2 text-xl text-black font-bold font-sans border-b-2 border-cyan-200">
          <Link to="/">Home</Link>
        </li>
        <li className="mb-2 p-2 text-xl text-black font-bold font-sans border-b-2 border-cyan-200">
          <Link to="/dashboard/my-videos">My Videos</Link>
        </li>
        <li className="mb-2 p-2 text-xl text-black font-bold font-sans border-b-2 border-cyan-200">
          <Link to="/dashboard/watch-history">Watch History</Link>
        </li>
        <li className="mb-2 p-2 text-xl text-black font-bold font-sans border-b-2 border-cyan-200">
          <Link to="/dashboard/upload-video">Upload Videos</Link>
        </li>
        <li className="mb-2 p-2 text-xl text-black font-bold font-sans border-b-2 border-cyan-200">
          <Link to="/channel">My Channel</Link>
        </li>

        <li className="mb-2 p-2 text-xl text-black font-bold font-sans border-b-2 border-cyan-200">
          <Link to="/dashboard/change-password">Change Password</Link>
        </li>
      </ul>
      {/* Logout link at the bottom of the div */}
      <div className="p-2 text-xl text-black font-bold font-sans border-b-2 border-cyan-200">
        <LogOutBtn />
      </div>
    </div>
  );
};

export default SidePanel;
