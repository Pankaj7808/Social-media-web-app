import axios from "axios";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { setAuth } from "../slice/AuthSlice";
import { useDispatch } from "react-redux";



function useAuth() {
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const getOtp = async (body) => {
    setLoading(true);
    try {
      const res = await axios.post("/auth/get-otp", body);
      enqueueSnackbar(res?.data?.message || "OTP sent successfully!", {
        variant: "success",
      });
      return true;
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || "Failed to send OTP", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const signup = async (payload) => {
    setLoading(true);
    try {
      const res = await axios.post("/auth/register", payload);
      dispatch(
        setAuth({
          isLoggedIn: true,
          user: res?.data?.user,
        })
      );
      enqueueSnackbar("Registered Successfully.", {
        variant: "success",
      });
      return res;
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || "Error in Singup"+err, { variant: "error" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (body) => {
    setLoading(true);
    try {
      const res = await axios.post("/auth/login", body);
      dispatch(setAuth({
        isLoggedIn: true,
        token: res?.data?.token,
        user: res?.data?.user,
      }));
      window.location = "/home"
      enqueueSnackbar("Login Successfully.", { variant: "success" });
      return res;
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (body) => {
    setLoading(true);
    try {
      const res = await axios.post('/auth/verify-otp', body);
      enqueueSnackbar(res?.data?.message || "Success", { variant: "success" });
      return true;
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || "Something went wrong", { variant: "error" });
      return false
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (body) => {
    setLoading(true);
    try {
      const res = await axios.put('/auth/reset-password', body);
      enqueueSnackbar(res?.data?.message, { variant: "success" })
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || "Something went wrong", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }


  return { loading, getOtp, signup, login, verifyOtp, resetPassword };
}

export default useAuth;
