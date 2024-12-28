import {createSlice} from '@reduxjs/toolkit';

const getDataFromLocalStorage = (key) => {
    let dataFromLocalStorage = {};
    try {
      dataFromLocalStorage = localStorage.getItem(key)
        ? JSON.parse(localStorage.getItem(key))
        : {};
    } catch (e) {
      return dataFromLocalStorage;
    }
    return dataFromLocalStorage;
  };

const AuthSlice = createSlice({
    name:"auth",
    initialState:{
        auth: {
            isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
            token: localStorage.getItem("token"),
            user: getDataFromLocalStorage("user"),
        }
    },
    reducers: {
        setAuth: (state, action) => {
          state.auth.isLoggedIn = action.payload.isLoggedIn;
          state.auth.token = action.payload.token;
          state.auth.user = action.payload.user;    
          localStorage.setItem("token", action.payload.token);
          localStorage.setItem("isLoggedIn", action.payload.isLoggedIn);
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        },
      },
})

export const { setAuth } = AuthSlice.actions;

export const selectAuth = (state) => state.app.auth;

export default AuthSlice.reducer;
