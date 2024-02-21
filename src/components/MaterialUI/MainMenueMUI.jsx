import React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import HomeIcon from "@mui/icons-material/Home";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import MailIcon from "@mui/icons-material/Mail";
import { useNavigate } from "react-router-dom";

export default function SwipeableTemporaryDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const handleNavigation = (text) => {
    let route;
    switch (text) {
      case "Dashboard":
        route = "/dashboard";
        break;
      case "My Videos":
        route = "/dashboard/my-videos";
        break;
      case "Watch History":
        route = "/dashboard/watch-history";
        break;
      case "My Channel":
        route = "/channel";
        break;
      default:
        route = "/";
    }
    navigate(route);
  };
  const list = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={onClose}
      onKeyDown={onClose}
    >
      <List>
        {["Dashboard", "My Videos", "Watch History", "My Channel"].map(
          (text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={() => handleNavigation(text)}>
                <ListItemIcon>
                  {index % 2 === 0 ? <HomeIcon /> : <OndemandVideoIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <SwipeableDrawer
      anchor="left"
      open={isOpen}
      onClose={onClose}
      onOpen={() => {}}
    >
      {list}
    </SwipeableDrawer>
  );
}
