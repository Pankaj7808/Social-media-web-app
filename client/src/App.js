import "./App.css";
import "./utils/Axios";
// import Auth from "./pages/Auth";
import { SnackbarProvider } from "notistack";
import Layout from "./pages/Layout";

function App() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "top", horizontal: "left" }}
      sx={{ boxShadow: "none" }}
    >
      <div className="App">
        {/* <Auth /> */}
        <Layout/>
      </div>
    </SnackbarProvider>
  );
}

export default App;
