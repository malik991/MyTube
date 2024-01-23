import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";

const store = configureStore({
  //define reducers
  reducer: {
    auth: authSlice,
  },
});

export default store;
