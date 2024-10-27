import { Chat, Group } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
  Typography,
} from "@mui/material";
import React from "react";
import Badge from "@mui/material/Badge";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

export default function RightSideBar() {
  return (
    <Box
      sx={{
        width: 240,
        padding: 2,
        position: "fixed", // Changed to fixed
        top: "73px",
        right: "0",
        height: "calc(100vh - 106px)",
        borderRight: "1px solid #ddd",
        zIndex: 9, // Ensures content spacing
        backgroundColor: "#fff",
        overflowY:"scroll"
      }}
    >
      {/* Favorites Section */}
      <Typography variant="subtitle1" fontWeight="bold" mb={2}>
        Recent Chats
      </Typography>
      <Divider />
      <List>
        <ListItem button sx={{ display: "flex", gap: 2 }}>
        <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <Avatar alt="Jeon Juvi" src="https://example.com/avatar.jpg" />
          </StyledBadge>
          <ListItemText primary="Jeon Juvi" secondary="Online" />
        </ListItem>
        <ListItem button sx={{ display: "flex", gap: 2 }}>
          <Avatar alt="Avinash Hajre" src="https://example.com/avatar.jpg" size={30} />
          <ListItemText primary="Avinash Hajre" secondary="2m ago" />
        </ListItem>
        <ListItem button sx={{ display: "flex",  gap: 2 }}>
          <Avatar alt="Avinash Hajre" src="https://example.com/avatar.jpg" size={30} />
          <ListItemText primary="Avinash Hajre" secondary="just now" />
        </ListItem>
      </List>

      <Typography variant="subtitle1" fontWeight="bold" mt={2} mb={2}>
        Online Friends
      </Typography>
      <Divider mt={2} />
      <List>
        <ListItem button sx={{ display: "flex", gap: 2 }}>
        <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <Avatar alt="Sikhar Dhavan" src="https://example.com/avatar.jpg" />
          </StyledBadge>
          <ListItemText primary="Shikhar Dhawan" />
        </ListItem>
        <ListItem button sx={{ display: "flex", gap: 2 }}>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <Avatar alt="Ranjan Dash" src="https://example.com/avatar.jpg" />
          </StyledBadge>
          <ListItemText primary="Ranjan Dash" />
        </ListItem>
        <ListItem button sx={{ display: "flex", gap: 2 }}>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <Avatar alt="Pawan Mandal" src="https://example.com/avatar.jpg" />
          </StyledBadge>
          <ListItemText primary="Pawan Mandal" />
        </ListItem>
        <ListItem button sx={{ display: "flex", gap: 2 }}>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <Avatar alt="Salman Khan" src="https://example.com/avatar.jpg" />
          </StyledBadge>
          <ListItemText primary="Salman Khan" />
        </ListItem>
        <ListItem button sx={{ display: "flex", gap: 2 }}>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <Avatar alt="Sanjay Dutt" src="https://example.com/avatar.jpg" />
          </StyledBadge>
          <ListItemText primary="Sanjay Dutt" />
        </ListItem>
        <ListItem button sx={{ display: "flex", gap: 2 }}>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <Avatar alt="MC Insane" src="https://example.com/avatar.jpg" />
          </StyledBadge>
          <ListItemText primary="MC Insane" />
        </ListItem>
        <ListItem button sx={{ display: "flex", gap: 2 }}>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <Avatar alt="Sundar K" src="https://example.com/avatar.jpg" />
          </StyledBadge>
          <ListItemText primary="Sundar K" />
        </ListItem>
      </List>
    </Box>
  );
}
