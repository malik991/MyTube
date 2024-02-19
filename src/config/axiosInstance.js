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
    // Make a request to your backend endpoint to refresh the access token
    const response = await axiosInstance.get("/users/new-access-token", {
      // Pass any necessary data (e.g., refresh token) in the request body
    });
    // Extract the new access token from the response
    const { accessToken } = response.data?.data;
    // console.log("response toekn axioinstance: ", accessToken);
    return accessToken;
  } catch (error) {
    // Handle error
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

    const serverErrorMessage = error.response?.data?.match(
      /<pre>([\s\S]*?)<\/pre>/
    )?.[1];
    let errorJWT;
    if (serverErrorMessage) {
      const splitContent = serverErrorMessage?.split("<br>");
      errorJWT = splitContent && splitContent[0].trim();
      //setError(splitContent ? splitContent[0].trim() : "An error occurred");
    }
    if (
      error.response.status === 403 &&
      errorJWT?.trim() === "Error: jwt expired"
      //error.response.data.trim() === "jwt expired"
    ) {
      try {
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
