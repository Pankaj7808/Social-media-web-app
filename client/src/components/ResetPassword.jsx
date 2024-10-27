import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import PassStrengthIndicator from "./PassStrengthIndicator";
import { useFormik } from "formik";
import * as Yup from "yup";
import Otp from "./common/Otp";

function ResetPassword({ getOtp, verifyOtp, resetPassword, loading }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resend, setResend] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [step, setStep] = useState(1);

  const emailvalidation = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
    otp: Yup.string()
      .matches(/^\d{6}$/, "OTP must be exactly 6 digits") // Regular expression for exactly 6 digits
      .required("OTP is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
  });

  const resetPasswordForm = useFormik({
    initialValues: {
      email: "",
      otp: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: emailvalidation,
    onSubmit: async (values) => {
      await resetPassword(values);
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft > 1) {
          return prevTimeLeft - 1;
        } else {
          clearInterval(interval);
          setResend(true);
          return 0;
        }
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [resendCount]);

  const handleOtpVerification = async () => {
    const resp = await verifyOtp({
      email: resetPasswordForm?.values?.email,
      otp: otp?.join(""),
    });
    resp && setStep(3);
  };

  const handleStepOne = async () => {
    const resp = await getOtp({
      email: resetPasswordForm?.values?.email,
      old_user: true,
    });
    resp && setStep(2);
  };

  useEffect(() => {
    resetPasswordForm?.setFieldValue("otp", otp.join(""));
  }, [otp]);

  return (
    <Card>
      <CardHeader
        title={<Typography variant="h6">Confirm your email address</Typography>}
      />
      <CardContent>
        <Box
          width={{ xs: "90%", sm: "400px", md: "500px" }}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
          p={2}
          m="auto"
        >
          {step === 1 && (
            <>
              <TextField
                label="Email"
                name="email"
                onChange={resetPasswordForm.handleChange}
                value={resetPasswordForm.values.email}
                fullWidth
                onBlur={resetPasswordForm.handleBlur}
                error={
                  resetPasswordForm.touched.email &&
                  Boolean(resetPasswordForm.errors.email)
                }
                helperText={
                  resetPasswordForm.touched.email &&
                  resetPasswordForm.errors.email
                }
              />
              <Button variant="contained" onClick={handleStepOne}>
                {loading ? <CircularProgress size={30} /> : "Get OTP"}
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <Typography variant="body2" alignSelf="flex-start">
                We have sent you a 6-digit code to email{" "}
                {resetPasswordForm?.email}. Enter it below.
              </Typography>
              <Typography
                alignSelf="flex-start"
                sx={{ cursor: "pointer" }}
                variant="body2"
                color="primary"
                onClick={() => setStep(1)}
              >
                Not you?
              </Typography>
              <Grid
                container
                spacing={{ xs: 1, md: 2 }}
                justifyContent="center"
              >
                <Otp otp={otp} setOtp={setOtp} />
              </Grid>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleOtpVerification}
                sx={{ mt: 1 }}
                disabled={resetPasswordForm?.errors?.otp}
              >
                {loading ? <CircularProgress size={30} /> : " Verify OTP"}
              </Button>
              <Box display="flex" alignSelf="flex-start" gap={1}>
                {resend ? (
                  <Typography
                    onClick={() => {
                      setResendCount((prev) => prev + 1);
                      setResend(false);
                      setTimeLeft(60);
                      setOtp(["", "", "", "", "", ""]);
                    }}
                    variant="body2"
                    color="primary"
                    sx={{ cursor: "pointer" }}
                  >
                    Resend OTP?
                  </Typography>
                ) : (
                  <Typography variant="body2">
                    Please wait {timeLeft}s to resend.
                  </Typography>
                )}
              </Box>
            </>
          )}
          {step === 3 && (
            <>
              <Typography variant="body2" alignSelf="flex-start">
                Please enter new password.
              </Typography>

              <TextField
                type="Password"
                name="password"
                fullWidth
                onChange={resetPasswordForm.handleChange}
                onBlur={resetPasswordForm.handleBlur}
                error={
                  resetPasswordForm.touched.password &&
                  Boolean(resetPasswordForm.errors.password)
                }
                helperText={
                  resetPasswordForm.touched.password &&
                  resetPasswordForm.errors.password
                }
                label="New Password"
              />
              <PassStrengthIndicator strength={2} />
              <TextField
                type="Password"
                name="confirmPassword"
                onChange={resetPasswordForm.handleChange}
                onBlur={resetPasswordForm.handleBlur}
                error={
                  resetPasswordForm.touched.confirmPassword &&
                  Boolean(resetPasswordForm.errors.confirmPassword)
                }
                helperText={
                  resetPasswordForm.touched.confirmPassword &&
                  resetPasswordForm.errors.confirmPassword
                }
                fullWidth
                label="Confirm Password"
              />
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 1 }}
                onClick={resetPasswordForm.handleSubmit}
              >
                {loading ? <CircularProgress size={30} /> : "Save Password"}
              </Button>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default ResetPassword;
