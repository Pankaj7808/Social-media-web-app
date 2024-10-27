import {
  AppBar,
  Avatar,
  Box,
  Container,
  InputBase,
  Typography,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LeftSidebar from "../components/Layout/LeftSideBar";
import RightSideBar from "../components/Layout/RightSideBar";

function Layout() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        borderBottom: "2px solid #eee",
        paddingY: "16px",
        backgroundColor: "#fff",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Title */}
        <Typography variant="h5" fontWeight="bold" color="primary">
          Connected
        </Typography>

        {/* Search Bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#f0f0f0",
            borderRadius: 1,
            paddingX: 2,
            paddingY: 0.5,
            minWidth: "300px",
          }}
        >
          <IconButton sx={{ p: 0 }}>
            <SearchIcon />
          </IconButton>
          <InputBase
            placeholder="Type in search"
            sx={{ ml: 1, flex: 1 }}
            inputProps={{ "aria-label": "search" }}
          />
        </Box>

        {/* User Info */}
        <Box display="flex" alignItems="center">
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            color="#000"
            sx={{ marginRight: "12px" }}
          >
            Pankaj Mandal
          </Typography>
          <Avatar alt="Pankaj Mandal" src="https://example.com/avatar.jpg" />
        </Box>
      </Container>
      <LeftSidebar/>
      <RightSideBar/>
    </AppBar>
  );
}

export default Layout;
