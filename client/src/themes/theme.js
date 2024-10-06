// theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#5267D3", // The primary color for "Connectly"
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif", // Set Poppins as the default font family for the entire project
  },
});

export default theme;
