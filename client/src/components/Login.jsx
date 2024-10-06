import {
  Box,
  Button,
  Card,
  CardContent,
  InputAdornment,
  TextField,
  Typography,
  Zoom,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { LoginContext } from "../pages/Login";


function Login({setLoginOpen, setLoginEmail}) {
  const { setShowLogin } = useContext(LoginContext);
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object({
    username: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const loginForm = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values));
    },
  });

  return (
    <Zoom in timeout={600}>
      <Card>
        <CardContent>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              variant="outlined"
              label="Email"
              name="username"
              value={loginForm.values.username}
              onChange={loginForm.handleChange}
              onBlur={loginForm.handleBlur}
              error={loginForm.touched.username && Boolean(loginForm.errors.username)}
              helperText={loginForm.touched.username && loginForm.errors.username}
              fullWidth
            />
            <TextField
              variant="outlined"
              label="Password"
              name="password"
              value={loginForm.values.password}
              onChange={loginForm.handleChange}
              onBlur={loginForm.handleBlur}
              type={showPassword ? "text" : "password"}
              fullWidth
              slotProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {showPassword ? (
                      <VisibilityOffIcon
                        onClick={() => setShowPassword(false)}
                        sx={{ cursor: "pointer" }}
                      />
                    ) : (
                      <VisibilityIcon
                        onClick={() => setShowPassword(true)}
                        sx={{ cursor: "pointer" }}
                      />
                    )}
                  </InputAdornment>
                ),
              }}
              error={loginForm.touched.password && Boolean(loginForm.errors.password)}
              helperText={loginForm.touched.password && loginForm.errors.password}
            />
              <Button
                variant="contained"
                size="large"
                disableElevation
                disableRipple
                onClick={loginForm.handleSubmit}                
              >
                <Typography
                  variant="subtitle1"
                  fontFamily="Poppins, sans-serif"
                  fontWeight="bold"
                  sx={{ textTransform: "none", letterSpacing: "1px" }}
                >
                  Login
                </Typography>
              </Button>
          </Box>
          <Box display="flex" gap={1} pt={2}>
            <Typography variant="subtitle2">Don't have an account?</Typography>
            <Typography
              color="primary"
              variant="subtitle2"
              sx={{ cursor: "pointer" }}
              onClick={() => setShowLogin(false)}
            >
              Sign up
            </Typography>
          </Box>
          <Typography
              color="primary"
              variant="subtitle2"
              sx={{ cursor: "pointer" }}
              onClick={()=>setLoginOpen(true)}
            >
              Forget Password?
            </Typography>
        </CardContent>
      </Card>
    </Zoom>
  );
}

export default Login;
