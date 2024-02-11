import React, { useState, useEffect, useRef } from "react";
import { Avatar } from "@mui/material";
import "../CustomDropdown.css"; // Import CSS for CustomDropdown styling

const CustomDropdown = ({ avatar, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAvatarClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    // setSelectedValue(option.value);
    onChange(option);
    setIsOpen(false);
    if (option.value === "logout" && option.action) {
      option.action(); // Call the logout action directly if provided
    }
  };

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <div className="avatar-container" onClick={handleAvatarClick}>
        <Avatar src={avatar} sx={{ width: 40, height: 40 }} />
      </div>
      {isOpen && (
        <ul className="dropdown-options">
          {options.map((option, index) => (
            <li key={index} onClick={() => handleOptionClick(option)}>
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
