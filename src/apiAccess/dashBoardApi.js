import axiosInstance from "../config/axiosInstance";

export const dashBoardData = async () => {
  try {
    const res = await axiosInstance.get(`/dashboard/channel-status`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    //console.log("auth res: ", res);
    return res;
  } catch (error) {
    console.error("Error in dashboard API fetch data:: ", error);
    throw error;
  }
};
