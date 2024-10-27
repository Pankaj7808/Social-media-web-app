import React, { useRef } from "react";
import Grid from "@mui/material/Grid2";
import { TextField } from "@mui/material";

function Otp({ otp, setOtp }) {
  const inputRefs = useRef([]);

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

  return (
    <>
      {otp?.map((digit, index) => (
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
                fontSize: "24px", // Larger font for better visibility
                fontWeight: "bold",
              },
            }}
            sx={{
              "& .MuiInputBase-input": {
                width: "50px",
                height: "50px",
                padding: "0",
                textAlign: "center", // Center the text
                fontSize: { xs: "18px", md: "24px" },
                fontWeight: "bold",
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px", // Rounded corners for better aesthetics
              },
            }}
            inputRef={(ref) => (inputRefs.current[index] = ref)}
          />
        </Grid>
      ))}
    </>
  );
}

export default Otp;
