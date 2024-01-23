import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dbServiceObj from "../apiAccess/confYoutubeApi";

// Define an initial state
const initialState = {
  videos: [],
  totalVideos: 0,
  currentPage: 1,
  totalPages: 0,
  status: "idle",
  error: null,
};

// Define an async thunk for fetching all videos with pagination
export const fetchAllVideos = createAsyncThunk(
  "videos/fetchAllVideos",
  async (options) => {
    try {
      const response = await dbServiceObj.getAllVideos(options);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Create a slice for handling video data and pagination
const videoSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllVideos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllVideos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.videos = action.payload.data.docs;
        state.totalVideos = action.payload.data.totalDocs;
        state.currentPage = action.payload.data.page;
        state.totalPages = action.payload.data.totalPages;
      })
      .addCase(fetchAllVideos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Export actions and reducer
export const {} = videoSlice.actions;
export default videoSlice.reducer;
