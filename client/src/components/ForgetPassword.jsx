import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import PassStrengthIndicator from "./PassStrengthIndicator";

function ForgetPassword() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resend, setResend] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [step, setStep] = useState(1);

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
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
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

  const handleOtpVerification = () => {
    const enteredOtp = otp.join("");
    setStep(3);
    console.log("Entered OTP:", enteredOtp);
  };

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
              <TextField label="Email" value={""} fullWidth />
              <Button variant="contained" onClick={() => setStep(2)}>
                Get OTP
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <Typography variant="body2" alignSelf="flex-start">
                We have sent you a 6-digit code to email {"mpankajmandall@gmail.com"}. Enter it below.
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
                onClick={handleOtpVerification}
                sx={{ mt: 1 }}
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
              </Box>
            </>
          )}
          {step === 3 && (
            <>
              <Typography variant="body2" alignSelf="flex-start">
                Please enter new password.
              </Typography>
              
              <TextField type="Password" fullWidth label="New Password"/>
              <PassStrengthIndicator strength={2}/>
              <TextField type="Password" fullWidth label="Confirm Password"/>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 1 }}
              >
                Save Password
              </Button>
              
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default ForgetPassword;
