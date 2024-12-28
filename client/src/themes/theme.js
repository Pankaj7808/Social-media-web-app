import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#5267D3", // The primary color for "Connectly"
    },
    grey: {
      light: "#f5f5f5",
      main: "#9e9e9e",
      dark: "#616161",
    },
    success: {
      main: "#4caf50", // Success color
    },
    error: {
      main: "#f44336", // Error color
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif", // Set Poppins as the default font family for the entire project
    // allVariants: {
    //   color: "#000000", // Set the default text color to black
    // },
  },
  text: {
    primary: '#000', // or whatever color you want for text
    secondary: '#888',
  },
});

export default theme;
