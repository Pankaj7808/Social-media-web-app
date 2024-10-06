import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
  Zoom,
} from "@mui/material";
import React, { createContext, useContext, useEffect } from "react";
import { LoginContext } from "../pages/Login";
import { useFormik } from "formik";
import * as Yup from "yup";
import PassStrengthIndicator from "./PassStrengthIndicator";

export const EmailContext = createContext();

function Register({
  setRegisterOpen,
  setEmail,
  emailRef,
  getOtp,
  loading,
  error,
  signUp,
}) {
  console.log(emailRef);
  const { setShowLogin } = useContext(LoginContext);

  const getPasswordStrengthMessage = (password) => {
    if (password.length === 0) return "";

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length > 8 && hasLetter && hasNumber && hasSymbol) return 3;
    if (password.length > 8 || (hasLetter && hasNumber && hasSymbol)) return 2;
    if (password.length >= 6 && (hasLetter || hasNumber)) return 1;

    return "";
  };

  const registerFormSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const registerForm = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerFormSchema,
    onSubmit: async (values) => {
      try {
          // Call getOtp and wait for it to complete
          await getOtp({ email: values?.email });
  
          // Only set registerOpen to true after getOtp completes
          setRegisterOpen(true);
      } catch (error) {
          // Handle any errors that occur during getOtp
          console.error("Error getting OTP:", error);
          // Optionally, show an error message to the user
      }
  }
  });

  useEffect(() => {
    setEmail(registerForm.values.email);
  }, [registerForm.values, setEmail]);

  return (
    <EmailContext.Provider value={{ email: registerForm.values.email }}>
      <Zoom in timeout={600}>
        <Card>
          <CardContent>
            <Box display="flex" flexDirection="column" gap={3}>
              <TextField
                variant="outlined"
                name="username"
                label="Username"
                onBlur={registerForm.handleBlur}
                error={
                  registerForm.touched.username &&
                  Boolean(registerForm.errors.username)
                }
                helperText={
                  registerForm.touched.username && registerForm.errors.username
                }
                onChange={registerForm.handleChange}
                fullWidth
              />
              <TextField
                variant="outlined"
                name="email"
                label="Email"
                fullWidth
                ref={emailRef}
                onBlur={registerForm.handleBlur}
                error={
                  registerForm.touched.email &&
                  Boolean(registerForm.errors.email)
                }
                helperText={
                  registerForm.touched.email && registerForm.errors.email
                }
                onChange={registerForm.handleChange}
              />
              <TextField
                variant="outlined"
                label="Password"
                type="password"
                name="password"
                value={registerForm.values.password}
                onChange={registerForm.handleChange}
                onBlur={registerForm.handleBlur}
                error={
                  registerForm.touched.password &&
                  Boolean(registerForm.errors.password)
                }
                helperText={
                  registerForm.touched.password && registerForm.errors.password
                }
                fullWidth
              />
              <PassStrengthIndicator
                strength={getPasswordStrengthMessage(
                  registerForm.values.password
                )}
              />
              <TextField
                variant="outlined"
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={registerForm.values.confirmPassword}
                onBlur={registerForm.handleBlur}
                error={
                  registerForm.touched.confirmPassword &&
                  Boolean(registerForm.errors.confirmPassword)
                }
                helperText={
                  registerForm.touched.confirmPassword &&
                  registerForm.errors.confirmPassword
                }
                onChange={registerForm.handleChange}
                fullWidth
              />
              <Button
                variant="contained"
                size="large"
                disableElevation
                disableRipple
                onClick={registerForm.handleSubmit}
              >
                
                  {loading?<CircularProgress color="inherit"/>:<Typography
                  variant="subtitle1"
                  fontFamily="Poppins, sans-serif"
                  fontWeight="bold"
                  sx={{ textTransform: "none", letterSpacing: "1px" }}
                >Sign Up</Typography>}
              </Button>
            </Box>
            <Box display="flex" gap={1} pt={2}>
              <Typography variant="subtitle2">
                Already have an account?
              </Typography>
              <Typography
                color="primary"
                variant="subtitle2"
                sx={{ cursor: "pointer" }}
                onClick={() => setShowLogin(true)}
              >
                Login
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Zoom>
    </EmailContext.Provider>
  );
}

export default Register;
