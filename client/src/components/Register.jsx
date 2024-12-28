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
import React, { useContext } from "react";
import { LoginContext } from "../pages/Auth";
import PassStrengthIndicator from "./PassStrengthIndicator";

function Register({
  open,
  loading,
  handleSubmit,
  registerForm,
}) {

  const { setShowLogin } = useContext(LoginContext);

  const getPasswordStrengthMessage = (password) => {
    if (password?.length === 0) return "";

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length > 8 && hasLetter && hasNumber && hasSymbol) return 3;
    if (password.length > 8 || (hasLetter && hasNumber && hasSymbol)) return 2;
    if (password.length >= 6 && (hasLetter || hasNumber)) return 1;

    return "";
  };

  return (
      <Zoom in timeout={600}>
        <Card>
          <CardContent>
            <Box display="flex" flexDirection="column" gap={3}>
              <TextField
                variant="outlined"
                name="name"
                label="Full Name"
                onBlur={registerForm.handleBlur}
                error={
                  registerForm.touched.name &&
                  Boolean(registerForm.errors.name)
                }
                helperText={
                  registerForm.touched.name && registerForm.errors.name
                }
                onChange={registerForm.handleChange}
                fullWidth
              />
              <TextField
                variant="outlined"
                name="email"
                label="Email"
                fullWidth
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
                  registerForm?.values?.password
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
                onClick={handleSubmit}
                disabled={!open && loading}
              >
                {(!open && loading) ? (
                  <CircularProgress color="inherit" size={30}/>
                ) : (
                  <Typography
                    variant="subtitle2"
                    fontFamily="Poppins, sans-serif"
                    fontWeight="bold"
                    sx={{ textTransform: "none", letterSpacing: "1px" }}
                  >
                    Sign Up
                  </Typography>
                )}
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
  );
}

export default Register;
