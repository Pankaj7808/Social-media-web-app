import axios from "axios";
import { useSnackbar } from "notistack";
import { useState } from "react";

function useUser() {
  const { enqueueSnackbar } = useSnackbar();

  const [users, setUsers] = useState([]);
  const followUser = async (data, currentUserId) => {
    try {
      axios.put(`/user/${currentUserId}/follow`, data);
      enqueueSnackbar("Followed Successfully.", { variant: "success" });
    } catch (error) {
      console.log(error);
    }
  };
  const unFollowUser = async (data, currentUserId) => {
    try {
      axios.put(`/user/${currentUserId}/unfollow`, data);
      enqueueSnackbar("Unfollowed Successfully.", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || "Something went wrong.",
        {
          variant: "error",
        }
      );
    }
  };

  const fetchAllUser = async () => {
    try {
      const res = await axios.get(`/user/`);
      setUsers(res.data);
      enqueueSnackbar("Users fetched successfully", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || "Something went wrong.", {
        variant: "error",
      });
    } finally {
    }
  };
  return {
    followUser,
    fetchAllUser,
    unFollowUser,
    users,
  };
}

export default useUser;

