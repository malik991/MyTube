import React, { useState, useEffect } from "react";
import SidePanel from "./SidePanel";
import { Container } from "../components";
import { useSelector } from "react-redux";
import { dashBoardData } from "../apiAccess/dashBoardApi";
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

  const userData = useSelector((state) => state.auth.userData);

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
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"],
        borderColor: "black",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex h-screen">
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
        <div className="py-2">
          <h2>
            Total Videos:{" "}
            <span className="text-red-500 text-xl font-semibold">
              {totalVideos}
            </span>{" "}
          </h2>
          <h2>
            Total Views:{" "}
            <span className="text-red-500 text-xl font-semibold">
              {totalVideoViews}
            </span>
          </h2>
          <h2>Total Subscribers: {totalSubscribers}</h2>
          <h2>Total Likes: {totalLikes}</h2>
        </div>
      </div>
    </div>
  );
};

export default DashBoardComponent;
