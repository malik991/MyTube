import conf from "../config/viteConfiguration";
import axios from "axios";

export const dashBoardData = async () => {
  try {
    const res = await axios.get(`${conf.ServerUrl}/dashboard/channel-status`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    //console.log("auth res: ", res);
    return res;
  } catch (error) {
    console.error("Error in dashboard API fetch data:: ", error);
    throw error;
  }
};
