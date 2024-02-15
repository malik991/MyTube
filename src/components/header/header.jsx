import React, { useState, useEffect } from "react";
import { Logo, Container, CustomDropdown } from "../index.js"; // Assuming these are your custom components
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { persistor } from "../../store/store";
import { logoutUser } from "../../apiAccess/auth";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const [avatar, setAvatar] = useState(userData?.avatar);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userData?.avatar) {
      setAvatar(userData.avatar);
    }
  }, [userData]);

  const handleDropdownChange = (option) => {
    // Handle dropdown change here
    console.log("Selected value:", option.value);
    if (option?.value === "profile") {
      navigate(option?.value);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    dispatch(logout());
    persistor.purge();
    navigate("/login");
  };

  const options = [
    { label: "Profile", value: "profile" },
    { label: "Logout", value: "logout", action: handleLogout },
  ];

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
  ];

  return (
    <header className="py-3 shadow-xl ring-inherit bg-[#F3F3F3] rounded-lg mx-2 mt-2">
      <Container>
        <nav className="flex">
          <>
            <div className="mr-4">
              <Link to="/">
                <Logo width="70px" />
              </Link>
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
                <div className="ml-3">
                  <li className="ml-2 text-lg">
                    <CustomDropdown
                      avatar={avatar}
                      options={options}
                      onChange={handleDropdownChange}
                    />
                  </li>
                </div>
              )}
            </ul>
          </>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
