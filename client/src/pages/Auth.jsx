import React, { createContext, useState } from "react";
import Grid from "@mui/material/Grid2";
import { Box, Dialog, Slide, Typography } from "@mui/material";
import Login from "../components/Login";
import Register from "../components/Register";
import VerifySignup from "../components/VerifySignup";
import ResetPassword from "../components/ResetPassword";
import useAuth from "../hooks/useAuth";
import { useFormik } from "formik";
import * as Yup from "yup";

export const LoginContext = createContext();

function Auth() {
  const { loading, getOtp, signup, login, verifyOtp, resetPassword } =
    useAuth();

  const [open, setRegisterOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [resetOtp, setResetOtp] = useState(1);

  const handleSignup = async (values) => {
    setResetOtp((resetOtp) => resetOtp + 1);
    const data = { ...values };
    delete data.confirmPassword;
    const resp = await signup(data);
    resp && setRegisterOpen(false);
  };

  const registerFormSchema = Yup.object({
    name: Yup.string().required("Full Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    otp: Yup.string()
      .matches(/^\d{6}$/, "OTP must be exactly 6 digits") // Regular expression for exactly 6 digits
      .required("OTP is required"),
  });

  const registerForm = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      otp: "",
    },
    validationSchema: registerFormSchema,
    onSubmit: async (values) => {
      handleSignup(values);
      setShowLogin(true);
    },
  });

  const handleVerification = async () => {
    // Mark all fields as touched to trigger validation messages
    registerForm.setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Run validation
    const errors = await registerForm.validateForm();

    // Proceed if there are no validation errors
    if (Object.keys(errors).length === 1) {
      const resp = await getOtp({
        email: registerForm?.values?.email,
        old_user: false,
      });
      resp && setRegisterOpen(true);
    }
  };

  const handleOpen = () => {
    setLoginOpen(true);
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
              <Login handleOpen={handleOpen} loading={loading} login={login} />
            ) : (
              <Register
                loading={loading}
                open={open}
                registerForm={registerForm}
                handleSubmit={handleVerification}
              />
            )}
          </Box>
        </Grid>
      </Grid>

      <Dialog onClose={() => setRegisterOpen(false)} open={open}>
        <VerifySignup
          email={registerForm?.values?.email}
          getOtp={getOtp}
          loading={loading}
          registerForm={registerForm}
          resetOtp={resetOtp}
        ></VerifySignup>
      </Dialog>

      <Dialog onClose={() => setLoginOpen(false)} open={loginOpen}>
        <ResetPassword
          getOtp={getOtp}
          verifyOtp={verifyOtp}
          resetPassword={resetPassword}
          loading={loading}
        />
      </Dialog>
    </LoginContext.Provider>
  );
}

export default Auth;
