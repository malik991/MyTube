import AccountMenu from "../AccountMenu.jsx";
import React, { useState, useEffect } from "react";
import { Logo, Container, CustomDropdown } from "../index.js"; // Assuming these are your custom components
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { persistor } from "../../store/store";
import { logoutUser } from "../../apiAccess/auth";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import { closeSnackbar } from "../../store/snackbarSlice";
import WidgetsIcon from "@mui/icons-material/Widgets";
import SwipeableTemporaryDrawer from "../MaterialUI/MainMenueMUI.jsx";
import Tooltip from "@mui/material/Tooltip";
import { logOut as playListLogout } from "../../store/playListSlice.js";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const res = await logoutUser();
      if (res) {
        dispatch(logout());
        dispatch(playListLogout());
        dispatch(closeSnackbar());
        persistor.purge();
        navigate("/login");
      }
    } catch (error) {
      console.log("error in header.jsx: ", error);
    }
  };

  const handleNavLinkClick = () => {
    setIsDrawerOpen(true);
  };

  // const options = [
  //   { label: "Profile", value: "profile" },
  //   { label: "Logout", value: "logout", action: handleLogout },
  // ];

  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "SignUp",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "Upload Video",
      slug: "/upload-video",
      active: authStatus,
    },
    {
      name: "DashBoard",
      slug: "/dashboard",
      active: authStatus,
    },
    {
      name: "My PlayList",
      slug: "/playlist",
      active: authStatus,
    },
  ];

  return (
    <header className="py-3 shadow-xl ring-inherit bg-[#F3F3F3] rounded-lg mx-2 mt-2">
      <Container>
        <nav className="flex items-center justify-between">
          <>
            <div className="flex items-center space-x-2 ">
              <Link to="/">
                <Logo className="w-10 h-auto" />
              </Link>
              {authStatus && (
                <Tooltip title="Menu">
                  <WidgetsIcon
                    className="cursor-pointer text-gray-700 hover:text-gray-900"
                    onClick={handleNavLinkClick}
                    fontSize="large"
                  />
                </Tooltip>
              )}
            </div>
            <ul className="flex ml-auto">
              {navItems.map((item) =>
                item.active ? (
                  <li key={item.name} className="ml-2 text-lg ">
                    <NavLink
                      to={item.slug}
                      className={({ isActive }) =>
                        `block py-2 pr-4 pl-3 duration-200 ${
                          isActive
                            ? "text-orange-700 font-bold"
                            : "text-gray-700"
                        } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                      }
                    >
                      {item.name}
                    </NavLink>
                  </li>
                ) : null
              )}
              {authStatus && (
                <div className="ml-0">
                  <li className="ml-1">
                    {userData && (
                      <AccountMenu
                        avatar={userData.avatar}
                        handleLogout={handleLogout}
                      />
                    )}
                    {/* <CustomDropdown
                      avatar={avatar}
                      options={options}
                      onChange={handleDropdownChange}
                    /> */}
                  </li>
                </div>
              )}
            </ul>
          </>
        </nav>
        <SwipeableTemporaryDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      </Container>
    </header>
  );
}

export default Header;
