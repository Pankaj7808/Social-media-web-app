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
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import LogoutIcon from '@mui/icons-material/Logout';

function LeftSidebar() {
  return (
    <Box
      sx={{
        width: 240,
        padding: 2,
        position: "fixed", // Changed to fixed
        top: "73px",
        height: "calc(100vh - 106px)",
        borderRight: "1px solid #ddd",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        zIndex:9, // Ensures content spacing
        backgroundColor:"#fff"
      }}
    >
      <div>
        {/* Navigation Links */}
        <List>
          {/* Home Link */}
          <ListItem button>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>

          {/* Profile Link */}
          <ListItem button>
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
        </List>

        <Divider />

        {/* Favorites Section */}
        <Typography variant="subtitle1" fontWeight="bold" mt={2} mb={1}>
          Favorites
        </Typography>
        <List>
          <ListItem button>
            <ListItemIcon>
              <Chat />
            </ListItemIcon>
            <ListItemText primary="Messages" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <Group />
            </ListItemIcon>
            <ListItemText primary="Friends" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <Event />
            </ListItemIcon>
            <ListItemText primary="Events" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <PhotoAlbumIcon />
            </ListItemIcon>
            <ListItemText primary="Stories" />
          </ListItem>
        </List>
      </div>

      {/* Help & Support Section at Bottom */}
      <div>
        <Divider sx={{ my: 2 }} />
        <List>
          <ListItem button>
            <ListItemIcon>
              <ContactSupportIcon />
            </ListItemIcon>
            <ListItemText primary="Help & Support" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Log out" />
          </ListItem>
        </List>
      </div>
    </Box>
  );
}

export default LeftSidebar;
