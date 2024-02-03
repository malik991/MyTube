import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import { logoutUser } from "../../apiAccess/auth";
import { useNavigate } from "react-router-dom";
import { persistor } from "../../store/store";

function LogOutBtn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleLogout() {
    await logoutUser();
    dispatch(logout());
    persistor.purge(); // remove data from local storage of persisit
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
