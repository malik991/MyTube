import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import { logoutUser } from "../../apiAccess/auth";
import { useCookies } from "react-cookie";

function LogOutBtn() {
  const dispatch = useDispatch();
  const [cookie, _, removeCookie] = useCookies();

  async function handleLogout() {
    const res = await logoutUser(cookie?.["accessToken"]);
    removeCookie("accessToken");
    removeCookie("refreshToken");
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
