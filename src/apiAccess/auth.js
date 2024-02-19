//import conf from "../config/viteConfiguration";
//import axios from "axios";
import axiosInstance from "../config/axiosInstance";
// login
export const loginUser = async ({ emailOrUserName, password }) => {
  try {
    const formData = new FormData();
    formData.append("emailOrUserName", emailOrUserName);
    formData.append("password", password);
    const res = await axiosInstance.post(`/users/login`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    //console.log("auth res: ", res);
    return res;
  } catch (error) {
    console.error("Error in login user:: ", error);
    throw error;
  }
};
// register user
export const registerUser = async ({
  userName,
  email,
  password,
  fullName,
  avatar,
  coverImage,
}) => {
  try {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("fullName", fullName);
    formData.append("avatar", avatar);
    formData.append("coverImage", coverImage[0]);
    // console.log("formData entries:");
    // for (var pair of formData.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }
    const res = await axiosInstance.post(`/users/register`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.status >= 200 && res.status < 300) {
      return res; // Assuming your API returns the user data upon successful registration
    } else {
      throw new Error(`Failed to register user. Status: ${res}`);
    }
  } catch (error) {
    console.error("Error in register user:: ", error);
    throw error;
  }
};

// logout user
export const logoutUser = async () => {
  try {
    const res = await axiosInstance.get(`/users/logout`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res;
  } catch (error) {
    console.error("Error in logout user:: ", error);
    throw error;
  }
};
// change password
export const changePassword = async ({ oldPassword, newPassword }) => {
  try {
    const formData = new FormData();
    formData.append("oldPassword", oldPassword);
    formData.append("newPassword", newPassword);
    const res = await axiosInstance.post(`/users/change-password`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res;
  } catch (error) {
    console.error("Error in change password:: ", error);
    throw error;
  }
};
// get current user
export const getCurrentUser = async () => {
  try {
    const res = await axiosInstance.post(
      `${conf.ServerUrl}/users/current-user`
    );
    return res;
  } catch (error) {
    console.error("Error in get current user :: ", error?.message);
    throw error?.message;
  }
};
// update user details
export const updateUserDetails = async ({ userName, email, fullName }) => {
  try {
    console.log(userName, email, fullName);
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("fullName", fullName);
    const res = await axiosInstance.patch(
      `${conf.ServerUrl}/users/update-account-details`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res;
  } catch (error) {
    console.error("Error in update user details:: ", error);
    throw error;
  }
};

// update avatar
export const updateAvatar = async (avatar) => {
  try {
    //console.log("avatr: ", avatar);
    const formData = new FormData();
    formData.append("avatar", avatar);
    const res = await axiosInstance.patch(
      `${conf.ServerUrl}/users/update-avatar`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res;
  } catch (error) {
    console.error("Error in update user Avatar :: ", error);
    throw error;
  }
};

// update cover image
export const updateCoverImage = async (coverImage) => {
  try {
    const formData = new FormData();
    formData.append("coverImage", coverImage);
    const res = await axiosInstance.patch(
      `/users/update-cover-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res;
  } catch (error) {
    console.error("Error in update user coverImage :: ", error);
    throw error;
  }
};

// get channel  profile
export const getChannelProfile = async (username) => {
  try {
    if (!username) {
      return "Invalid UserName";
    }
    const res = await axiosInstance.get(`/users/c/${username}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res;
  } catch (error) {
    console.error("Error in getChannelProfile :: ", error);
    throw error;
  }
};

// add watch history
export const addWatchHistory = async (videoId) => {
  try {
    if (!videoId) {
      return "Invalid videoId";
    }
    const res = await axiosInstance.post(
      `/users/add-watch-history/${videoId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res;
  } catch (error) {
    console.error("Error in add watch history :: ", error);
    throw error;
  }
};
// get watch hostory
export const getWatchHistory = async (page = 1) => {
  try {
    let url = `/users/watch-history`;
    const queryParams = new URLSearchParams({
      page: page.toString(), // Convert page to string
    });
    url += `?${queryParams.toString()}`;
    const res = await axiosInstance.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res;
  } catch (error) {
    console.error("Error in get watch history :: ", error);
    throw error;
  }
};

// toggled subscription
export const toggledSubscription = async (channelUserName) => {
  try {
    const res = await axiosInstance.post(
      `/users/toggled-subscription/${channelUserName}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res;
  } catch (error) {
    console.error("Error in toggled subscription :: ", error);
    throw error?.message;
  }
};

// get subscribers of the channel
export const getSubscribersOfChannel = async (page = 1, channelId) => {
  try {
    let url = `/users/get-subscribers/${channelId}`;
    const queryParams = new URLSearchParams({
      page: page.toString(), // Convert page to string
    });
    url += `?${queryParams.toString()}`;
    const res = await axiosInstance.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res;
  } catch (error) {
    console.error("Error in get subscribers :: ", error);
    throw error;
  }
};

// get channel subscribeTo
export const getChannelsSubscribeTo = async (page = 1, subscriberId) => {
  try {
    // console.log("susbcriber id:", subscriberId);
    let url = `/users/get-channel-list/${subscriberId}`;
    const queryParams = new URLSearchParams({
      page: page.toString(), // Convert page to string
    });
    url += `?${queryParams.toString()}`;
    const res = await axiosInstance.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res;
  } catch (error) {
    console.error("Error in get channel subscribeTo :: ", error);
    throw error;
  }
};
