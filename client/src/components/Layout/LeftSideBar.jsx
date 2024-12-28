import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import { Home, Chat, Group, Event, Person } from "@mui/icons-material";
import PhotoAlbumIcon from "@mui/icons-material/PhotoAlbum";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate, useLocation } from "react-router-dom";

function LeftSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // List of main menu items with icon components directly used
  const menuItems = [
    { name: "Home", icon: <Home />, route: "/home" },
    { name: "Profile", icon: <Person />, route: "/profile" },
  ];

  // List of favorite items (Messages, Friends, Events, Stories)
  const favoriteItems = [
    { name: "Messages", icon: <Chat />, route: "/messages" },
    { name: "Friends", icon: <Group />, route: "/friends" },
    { name: "Events", icon: <Event />, route: "/events" },
    { name: "Stories", icon: <PhotoAlbumIcon />, route: "/stories" },
  ];

  // Favorites section items
  const bottomItems = [
    { name: "Help & Support", icon: <ContactSupportIcon />, route: "/help" },
    { name: "Log out", icon: <LogoutIcon />, route: "/logout" },
  ];

  // Function to handle link clicks
  const handleLinkClick = (route) => {
    navigate(route); // Change the route
  };

  return (
    <Box
      sx={{
        width: 240,
        padding: 2,
        top: "73px",
        height: "calc(100vh - 106px)",
        borderRight: "1px solid #ddd",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#fff",
      }}
    >
      {/* Navigation Links */}
      <Box>
        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.name}
              button
              onClick={() => handleLinkClick(item.route)}
              sx={{ cursor: "pointer" }}
            >
              <ListItemIcon>
                {React.cloneElement(item.icon, {
                  sx: {
                    color:
                      location.pathname === item.route
                        ? "primary.main"
                        : "text.secondary",
                  },
                })}
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                sx={{
                  color:
                    location.pathname === item.route
                      ? "primary.main"
                      : "text.primary",
                }}
              />
            </ListItem>
          ))}
        </List>

        <Divider />

        {/* Favorites Section */}
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          mt={2}
          mb={1}
          sx={{ color: "text.primary" }}
        >
          Favorites
        </Typography>
        <List>
          {favoriteItems.map((item) => (
            <ListItem
              key={item.name}
              button
              onClick={() => handleLinkClick(item.route)}
              sx={{ cursor: "pointer" }}
            >
              <ListItemIcon>
                {React.cloneElement(item.icon, {
                  sx: {
                    color:
                      location.pathname === item.route
                        ? "primary.main"
                        : "text.secondary",
                  },
                })}
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                sx={{
                  color:
                    location.pathname === item.route
                      ? "primary.main"
                      : "text.primary",
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Help & Support Section */}
      <Box>
        <List>
          <ListItem
            button
            onClick={() => handleLinkClick("/help")}
            sx={{ cursor: "pointer" }}
          >
            <ListItemIcon>
              <ContactSupportIcon sx={{ color: "text.secondary" }} />
            </ListItemIcon>
            <ListItemText primary="Help & Support" />
          </ListItem>
          <ListItem
            button
            onClick={() => handleLinkClick("/logout")}
            sx={{ cursor: "pointer" }}
          >
            <ListItemIcon>
              <LogoutIcon sx={{ color: "error.main" }} />
            </ListItemIcon>
            <ListItemText primary="Log out" sx={{ color: "error.main" }} />
          </ListItem>
        </List>
      </Box>
    </Box>
  );
}

export default LeftSidebar;
