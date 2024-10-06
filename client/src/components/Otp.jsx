import React, { useEffect, useState, useRef } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

function OtpInput({ email, handleEmailFocus, verifyOtp }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resend, setResend] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  const inputRefs = useRef([]);

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
      clearInterval(interval); // Cleanup the interval on component unmount
    };
  }, [resendCount]);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]?$/.test(value)) { // Allow only numbers
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Automatically focus on the next input if the current input has a value
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (otp[index] === "") {
        if (index > 0) {
          inputRefs.current[index - 1].focus();
        }
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleSubmit = () => {
    const enteredOtp = otp.join("");
    verifyOtp({email:email, otp: enteredOtp})
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      p={2}
    >
      <Typography variant="h6" gutterBottom>
        Confirm your email address
      </Typography>
      <Typography variant="body2" gutterBottom>
        We have sent you a 6-digit code to email {email}.<br />
        Enter it below.
      </Typography>
      <Grid container spacing={{ xs: 1, md: 2 }} justifyContent="center">
        {otp.map((digit, index) => (
          <Grid item key={index} xs={2}>
            <TextField
              id={`otp-input-${index}`}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              variant="outlined"
              inputProps={{
                maxLength: 1,
                style: {
                  textAlign: "center",
                  fontSize: { xs: "12px", md: "24px" },
                  fontWeight: "bold",
                },
              }}
              sx={{
                "& .MuiInputBase-input": {
                  width: { xs: "30px", md: "50px" },
                  height: { xs: "30px", md: "50px" },
                  padding: 0,
                },
              }}
              inputRef={(ref) => (inputRefs.current[index] = ref)}
            />
          </Grid>
        ))}
      </Grid>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleSubmit}
        sx={{ mt: 4 }}
      >
        Verify OTP
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
        <Typography
          variant="body2"
          color="primary"
          onClick={handleEmailFocus}
          sx={{ cursor: "pointer" }}
        >
          Change email?
        </Typography>
      </Box>
    </Box>
  );
}

export default OtpInput;
