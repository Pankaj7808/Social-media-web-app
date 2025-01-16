import "./App.css";
import "./utils/Axios";
// import Auth from "./pages/Auth";
import { SnackbarProvider } from "notistack";
import Layout from "./pages/Layout";
import { IconButton } from "@mui/material";
import { useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import AppRoutes from "./routing/AppRoutes";


function App() {

  const notistackRef = useRef();

  const onClickSnackBarClose = (key) => {
    // @ts-ignore
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "top", horizontal: "left" }}
      ref={notistackRef}
      sx={{ boxShadow: "none" }}
      autoHideDuration={3000}
      action={(key) => (
        <IconButton onClick={() => onClickSnackBarClose(key)}>
          <CloseIcon color="#ffffff" />
        </IconButton>
      )}
    >
      <AppRoutes />
    </SnackbarProvider>
    

  );
}

export default App;
