import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../config/axiosInstance";

// fetch all playlist of logged in user
export const fetchPlayLists = createAsyncThunk(
  "playListThunk/fetchPlayLists",
  async (page = 1) => {
    try {
      let url = `/playlist/check-user-playlist`;
      const queryParams = new URLSearchParams({
        page: page.toString(), // Convert page to string
      });
      url += `?${queryParams.toString()}`;
      const res = await axiosInstance.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      //console.log("data in slice: ", res.data.data);
      return res.data?.data;
    } catch (error) {
      console.log("Error in PlayList Thunk:: ", error);
      throw error;
    }
  }
);

const initialState = {
  userPlayLists: [], // Use an object to store posts for each user
  status: "idle",
  totalPages: 1, // Initialize totalPages to 1
  error: null,
};

const PlayListThunk = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    logOut: (state) => {
      state.status = "idle";
      state.userPlayLists = [];
      state.totalPages = 1;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayLists.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPlayLists.fulfilled, (state, action) => {
        if (action.payload.length === 0) {
          state.status = "idle";
        } else {
          state.status = "succeeded";
          state.userPlayLists = action.payload;
          state.totalPages = action.payload.totalPages;
          //const userId = action.meta.arg;
          //console.log("user id: ", userId);
          //state.userPosts[userId] = action.payload;
          state.error = null;
        }
      })
      .addCase(fetchPlayLists.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { logOut } = PlayListThunk.actions;

export default PlayListThunk.reducer;
