import axios from "axios";
import conf from "./viteConfiguration";

// Create an Axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: conf.ServerUrl,
  withCredentials: true, // Include cookies in requests
});

// Function to refresh access token
async function refreshAccessToken() {
  try {
    const response = await axiosInstance.get("/users/new-access-token", {});
    // Extract the new access token from the response
    const { accessToken } = response.data?.data;
    //console.log("response toekn axioinstance: ", accessToken);
    return accessToken;
  } catch (error) {
    throw error;
  }
}

// Add a response interceptor to handle token refreshing
axiosInstance.interceptors.response.use(
  // the following function intercept if response is ok 2xx than sent back
  function (response) {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (error?.response?.status === 403 && !error.response.data.success) {
      try {
        console.log(
          "new Error: ",
          error.response.status,
          "isSuucess: ",
          error.response.data.success
        );
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        // Retry the original request with the new access token
        return axiosInstance(originalRequest);
      } catch (error) {
        // Handle refresh token failure (e.g., redirect to login page)
        throw error;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
