import conf from "../config/viteConfiguration";
import axios from "axios";

// login
export const loginUser = async ({ emailOrUserName, password }) => {
  try {
    const formData = new FormData();
    formData.append("emailOrUserName", emailOrUserName);
    formData.append("password", password);
    const res = await axios.post(`${conf.ServerUrl}/users/login`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
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
    formData.append("avatar", avatar[0]);
    formData.append("coverImage", coverImage[0]);
    // console.log("formData entries:");
    // for (var pair of formData.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }
    const res = await axios.post(`${conf.ServerUrl}/users/register`, formData, {
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
    const res = await axios.get(`${conf.ServerUrl}/users/logout`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return res;
  } catch (error) {
    console.error("Error in logout user:: ", error);
    throw error;
  }
};
// change password
export const changePassword = async (oldPassword, newPassword) => {
  try {
    const res = await axios.post(`${conf.ServerUrl}/users/change-password`, {
      oldPassword,
      newPassword,
    });
    return res;
  } catch (error) {
    console.error("Error in change password:: ", error?.message);
    throw error?.message;
  }
};
// get current user
export const getCurrentUser = async () => {
  try {
    const res = await axios.post(`${conf.ServerUrl}/users/current-user`);
    return res;
  } catch (error) {
    console.error("Error in get current user :: ", error?.message);
    throw error?.message;
  }
};
// update user details
export const updateUserDetails = async (userName, email, fullName) => {
  try {
    const res = await axios.post(
      `${conf.ServerUrl}/users/update-account-details`,
      {
        userName,
        email,
        fullName,
      }
    );
    return res;
  } catch (error) {
    console.error("Error in update user details:: ", error?.message);
    throw error?.message;
  }
};

// update avatar
export const updateAvatar = async ({ avatar }) => {
  try {
    const formData = new FormData();
    formData.append("avatar", avatar);
    const res = await axios.post(
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
    console.error("Error in update user Avatar :: ", error?.message);
    throw error?.message;
  }
};

// update cover image
export const updateCoverImage = async ({ coverImage }) => {
  try {
    const formData = new FormData();
    formData.append("coverImage", coverImage);
    const res = await axios.post(
      `${conf.ServerUrl}/users/update-cover-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res;
  } catch (error) {
    console.error("Error in update user coverImage :: ", error?.message);
    throw error?.message;
  }
};

// get channel  profile
export const getChannelProfile = async (username) => {
  try {
    if (!username) {
      return "Invalid UserName";
    }
    const res = await axios.get(`${conf.ServerUrl}/users/c/${username}`);
    return res;
  } catch (error) {
    console.error("Error in getChannelProfile :: ", error);
    throw error?.message;
  }
};

// add watch history
export const addWatchHistory = async (videoId) => {
  try {
    if (!videoId) {
      return "Invalid videoId";
    }
    const res = await axios.post(
      `${conf.ServerUrl}/users/add-watch-history/${videoId}`
    );
    return res;
  } catch (error) {
    console.error("Error in add watch history :: ", error);
    throw error?.message;
  }
};
// get watch hostory
export const getWatchHistory = async () => {
  try {
    const res = await axios.get(`${conf.ServerUrl}/users/watch-history`);
    return res;
  } catch (error) {
    console.error("Error in get watch history :: ", error);
    throw error?.message;
  }
};

// toggled subscription
export const toggledSubscription = async (channelUserName) => {
  try {
    const res = await axios.post(
      `${conf.ServerUrl}/users/toggled-subscription/${channelUserName}`
    );
    return res;
  } catch (error) {
    console.error("Error in toggled subscription :: ", error);
    throw error?.message;
  }
};

// get subscribers of the channel
export const getSubscribersOfChannel = async (channelId) => {
  try {
    const res = await axios.post(
      `${conf.ServerUrl}/users/get-subscribers/${channelId}`
    );
    return res;
  } catch (error) {
    console.error("Error in get subscribers :: ", error);
    throw error?.message;
  }
};

// get channel subscribeTo
export const getChannelsSubscribeTo = async (subscriberId) => {
  try {
    const res = await axios.post(
      `${conf.ServerUrl}/users/get-channel-list/${subscriberId}`
    );
    return res;
  } catch (error) {
    console.error("Error in get channel subscribeTo :: ", error);
    throw error?.message;
  }
};
