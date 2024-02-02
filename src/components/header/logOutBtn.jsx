import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import { logoutUser } from "../../apiAccess/auth";
import { useNavigate } from "react-router-dom";

function LogOutBtn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleLogout() {
    await logoutUser();
    dispatch(logout());
    navigate("/login");
  }

  return (
    <button
      className="inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}

export default LogOutBtn;
