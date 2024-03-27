import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ScreenSearchDesktopTwoToneIcon from "@mui/icons-material/ScreenSearchDesktopTwoTone";
import SearchVideos from "../MaterialUI/searchComponent.jsx";
import { BootstrapTooltips } from "../MaterialUI/CustomizedTooltips.jsx";
import WidgetsIcon from "@mui/icons-material/Widgets";
import AccountMenu from "../AccountMenu.jsx";
import { persistor } from "../../store/store.js";
import { logoutUser } from "../../apiAccess/auth.js";
import { logout } from "../../store/authSlice.js";
import { closeSnackbar } from "../../store/snackbarSlice.js";
import SwipeableTemporaryDrawer from "../MaterialUI/MainMenueMUI.jsx";
import { logOut as playListLogout } from "../../store/playListSlice.js";

function ResponsiveAppBar() {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchVideo, setSearchVideo] = React.useState(false);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const pages = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "About",
      slug: "/about",
      active: !authStatus,
    },
    {
      name: "Contact",
      slug: "/contact",
      active: !authStatus,
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
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handlePageButtonClick = (slug) => {
    navigate(slug);
    handleCloseNavMenu();
  };
  const openSearchDialog = () => {
    setSearchVideo(true);
  };
  const handleCloseSearchDialog = () => {
    setSearchVideo(false);
    //console.log("close called: ", searchVideo);
  };
  const handleNavLinkClick = () => {
    setIsDrawerOpen(true);
  };
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map(
                (page) =>
                  page.active && (
                    <MenuItem
                      key={page.slug}
                      onClick={() => handlePageButtonClick(page.slug)}
                    >
                      <Typography textAlign="center">{page.name}</Typography>
                    </MenuItem>
                  )
              )}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) =>
              page.active ? (
                <Button
                  key={page.slug}
                  onClick={() => handlePageButtonClick(page.slug)}
                  //onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page.name}
                </Button>
              ) : null
            )}
          </Box>

          <Box
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <Tooltip title="Search Videos">
              <ScreenSearchDesktopTwoToneIcon
                className="cursor-pointer text-gray-700 hover:text-red-700"
                fontSize="large"
                onClick={openSearchDialog}
              />
            </Tooltip>
            {searchVideo && (
              <SearchVideos
                open={searchVideo}
                handleClose={handleCloseSearchDialog}
              />
            )}
            {authStatus && (
              <>
                <BootstrapTooltips title="Menu">
                  <WidgetsIcon
                    className=" ml-2 cursor-pointer text-gray-700 hover:text-red-700"
                    onClick={handleNavLinkClick}
                    fontSize="large"
                  />
                </BootstrapTooltips>
                {userData && (
                  <AccountMenu
                    avatar={userData.avatar}
                    handleLogout={handleLogout}
                  />
                )}
              </>
            )}
          </Box>
        </Toolbar>
        <SwipeableTemporaryDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
