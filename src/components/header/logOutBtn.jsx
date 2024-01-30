import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import { logoutUser } from "../../apiAccess/auth";

function LogOutBtn() {
  const dispatch = useDispatch();

  async function handleLogout() {
    await logoutUser();
    dispatch(logout());
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
