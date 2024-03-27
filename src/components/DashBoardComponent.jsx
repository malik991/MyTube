import React, { useState, useEffect } from "react";
import SidePanel from "./SidePanel";
import { useSelector, useDispatch } from "react-redux";
import { dashBoardData } from "../apiAccess/dashBoardApi";
import { Outlet, useLocation } from "react-router-dom";
import CustomSnackbar from "./CustomSnackbar";
import { closeSnackbar } from "../store/snackbarSlice";
import {
  Chart as chartjs,
  BarElement,
  CategoryScale,
  LinearScale, // y
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

chartjs.register(
  BarElement,
  CategoryScale,
  LinearScale, // y
  Tooltip,
  Legend
);

const DashBoardComponent = () => {
  const [totalVideoViews, setTotalVideoViews] = useState(0);
  const [totalSubscribers, setTotalSubscribers] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.auth.userData);
  const location = useLocation();

  const handleClose = () => {
    dispatch(closeSnackbar());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await dashBoardData();
      if (result?.data) {
        setTotalVideoViews(result?.data?.data?.totalVideoViews || 0);
        setTotalSubscribers(result?.data?.data?.totalSubscribers || 0);
        setTotalVideos(result?.data?.data?.totalVideos || 0);
        setTotalLikes(result?.data?.data?.totalLikes || 0);
      }
    } catch (error) {
      console.log(
        "Error while fetching data in dashboard component.jsx: ",
        error
      );
    }
  };

  const barChartData = {
    labels: ["Total Videos", "Total Views", "Total Subscribers", "Total Likes"],
    datasets: [
      {
        label: "Count",
        data: [totalVideos, totalVideoViews, totalSubscribers, totalLikes],
        backgroundColor: ["#FAA300", "#A0153E", "#008DDA", "#FFB5DA"],
        borderColor: "black",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex h-screen">
      <CustomSnackbar handleClose={handleClose} />
      <SidePanel />
      <div className="flex-1 flex flex-col overflow-y-auto p-4">
        <h1 className="text-xxl text-red-500 font-serif font-bold">
          Dashboard Content
        </h1>
        <br />
        <h1 className="text-lg text-green-400 font-serif font-bold">
          {" "}
          Hello {userData?.userName}
        </h1>
        {location.pathname === "/dashboard" && (
          <>
            <div className="py-4">
              <Bar
                data={barChartData}
                options={{
                  scales: {
                    y: { beginAtZero: true },
                  },
                }}
              ></Bar>
            </div>
            <div className="py-2 bg-customLightGreen mx-3 px-4 flex items-center justify-evenly">
              <div className="py-2 flex flex-col">
                <h1>Videos</h1>
                <span className="text-red-500 py-2 text-xl font-semibold">
                  {totalVideos}
                </span>
              </div>
              <hr className="border-l-4 border-customeBorderLine h-1/2" />
              <div className="py-2 flex flex-col">
                <h1>Views</h1>
                <span className="text-red-500 py-2 text-xl font-semibold">
                  {totalVideoViews}
                </span>
              </div>
              <hr className="border-l-4 border-customeBorderLine h-1/2 " />
              <div className="py-2 flex flex-col">
                <h1>Subscribers</h1>
                <span className="text-red-500 py-2 text-xl font-semibold">
                  {totalSubscribers}
                </span>
              </div>
              <hr className="border-l-4 border-customeBorderLine h-1/2" />
              <div className="py-2 flex flex-col">
                <h1>Likes</h1>
                <span className="text-red-500 py-2 text-xl font-semibold">
                  {totalLikes}
                </span>
              </div>
            </div>
          </>
        )}
        <Outlet />
      </div>
    </div>
  );
};

export default DashBoardComponent;
