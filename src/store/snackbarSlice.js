import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
  message: "",
};

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    openSnackbar: (state, action) => {
      state.open = true;
      state.message = action.payload;
    },
    closeSnackbar: (state) => {
      state.open = false;
      state.message = "";
    },
  },
});

export const { openSnackbar, closeSnackbar } = snackbarSlice.actions;

export default snackbarSlice.reducer;
