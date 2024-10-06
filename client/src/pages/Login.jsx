import React, { createContext, useRef, useState } from "react";
import Grid from "@mui/material/Grid2";
import { Box, Dialog, Slide, Typography } from "@mui/material";
import Login from "../components/Login";
import Register from "../components/Register";
import OtpInput from "../components/Otp";
import ForgetPassword from "../components/ForgetPassword";
import useAuth from "../hooks/useAuth";
import axios from 'axios';

console.log(axios.defaults.baseURL)
export const LoginContext = createContext();

function LoginPage() {
  const [open, setRegisterOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [showLogin, setShowLogin] = useState(true);
  const emailRef = useRef(null);

  const { loading, error, signUp, getOtp, verifyOtp } = useAuth();

  const handleEmailFocus = () => {
    setRegisterOpen(false);
    if (emailRef.current) {
      setTimeout(() => {
        if (emailRef.current) {
          emailRef.current.focus();
        }
      }, 1000);
    }
  };

  return (
    <LoginContext.Provider value={{ setShowLogin }}>
      <Grid
        container
        spacing={{ xs: 2, md: 8 }}
        alignItems="center"
        height="100vh"
      >
        <Grid
          item
          size={{ md: 6, xs: 12 }}
          sx={{
            display: "flex",
            justifyContent: {
              xs: "center",
              md: "flex-end",
            },
          }}
        >
          <Box>
            <Slide direction="right" timeout={600} in>
              <Typography
                variant="h3"
                sx={{
                  textAlign: {
                    xs: "center",
                    md: "left",
                  },
                }}
                fontWeight="bold"
                color="primary"
              >
                Connectly
              </Typography>
            </Slide>
            <Typography variant="h6">
              Discover, Connect, Thrive Together
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          size={{ md: 6, xs: 12 }}
          sx={{
            display: "flex",
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
          <Box width={{ xs: "90%", md: "60%" }}>
            {showLogin ? (
              <Login setLoginOpen={setLoginOpen} />
            ) : (
              <Register
                loading={loading}
                error={error}
                signUp={signUp}
                open={open}
                emailRef={emailRef}
                setRegisterOpen={setRegisterOpen}
                setEmail={setEmail}
                getOtp={getOtp}
              />
            )}
          </Box>
        </Grid>
      </Grid>
      <Dialog onClose={() => setRegisterOpen(false)} open={open}>
        <OtpInput verifyOtp={verifyOtp} email={email} handleEmailFocus={handleEmailFocus} />
      </Dialog>
      <Dialog onClose={() => setLoginOpen(false)} open={loginOpen}>
        <ForgetPassword handleEmailFocus={handleEmailFocus} />
      </Dialog>
    </LoginContext.Provider>
  );
}

export default LoginPage;
