import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Otp from "./common/Otp";

function VerifySignup({ email, getOtp, loading, registerForm, resetOtp, children }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resend, setResend] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

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

  const resendOtp = async () => {
    await getOtp({email, old_user:false});
    setResendCount((prev) => prev + 1);
    setResend(false);
    setTimeLeft(60);
    setOtp(["", "", "", "", "", ""]);
  };

  useEffect(() => {
    registerForm?.setFieldValue("otp", otp.join(""));
  },[otp]);

  useEffect(()=>{
    setOtp(["", "", "", "", "", ""]);
  },[resetOtp])

  return (
    <Box p={2}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={2}
      >
        <Typography variant="h6" gutterBottom>
          Confirm your email address
        </Typography>
        <Typography variant="body2" gutterBottom>
          We have sent you a 6-digit code to email {email}.<br />
          Enter it below.
        </Typography>
        <Grid container spacing={{ xs: 1, md: 2 }} justifyContent="center">
          <Otp otp={otp} setOtp={setOtp} />
        </Grid>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={registerForm?.handleSubmit}
          sx={{ mt: 4 }}
          disabled={registerForm?.errors?.otp}
        >
          Verify OTP
        </Button>
        <Box display="flex" alignSelf="flex-start" gap={1}>
          {resend ? (
            <Typography
              onClick={resendOtp}
              variant="body2"
              disabled={loading}
              color={loading ? "textPrimary" : "primary"}
              sx={{ cursor: "pointer" }}
            >
              {loading ? "Sending..." : "Resend OTP?"}
            </Typography>
          ) : (
            <Typography variant="body2">
              Please wait {timeLeft}s to resend.
            </Typography>
          )}
        </Box>
      </Box>
      {children}
    </Box>
  );
}

export default VerifySignup;
