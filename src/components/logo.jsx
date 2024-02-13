import React from "react";

function Logo({ width = "70px" }) {
  return (
    <div>
      <img
        src="/logo.png" // Replace with the path to your logo image
        alt="Logo"
        style={{ width: width, height: "auto" }}
      />
    </div>
  );
}

export default Logo;
