// src/SidePanel.js
import React from "react";
import { Link } from "react-router-dom";

const SidePanel = () => {
  return (
    <div className="w-1/4 bg-gray-800 p-4 text-white">
      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/logout">Logout</Link>
        </li>
        <li>
          <Link to="/my-videos">My Videos</Link>
        </li>
        <li>
          <Link to="/upload-video">Upload Videos</Link>
        </li>
      </ul>
    </div>
  );
};

export default SidePanel;
