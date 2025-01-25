import axios from "axios";
import { useState } from "react";



function useUser() {
    const[users,setUsers] = useState([])
  const followUser = async (data, currentUserId) => {
    try {
      axios.put(`/user/${currentUserId}/follow`, data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchAllUser = async () => {
   
    try {
      const res = await axios.get(`/user/`);
      setUsers(res.data);
    //   enqueueSnackbar("Users fetched successfully", { variant: "success" });
    } catch (err) {
    //   enqueueSnackbar(err.response?.data?.message || "Couldn't fetch users", {
    //     variant: "error",
    //   });
    } finally {
     
    }
  };
  return {
    followUser,
    fetchAllUser,
    users,
  };
}

export default useUser;
