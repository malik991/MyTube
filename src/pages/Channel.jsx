import React, { useState, useEffect } from "react";
import { ChannelComponent, MyVideoComponent } from "../components";
import { getChannelProfile } from "../apiAccess/auth";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

const Channel = () => {
  const [channelProfile, setChannelProfile] = useState({});
  const [error, setError] = useState("");
  const userData = useSelector((state) => state.auth.userData);
  const authStatus = useSelector((state) => state.auth.status);
  const [showAlert, setShowAlert] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetchData();
    ///
  }, [location.search]);

  const fetchData = async () => {
    try {
      const searchParams = new URLSearchParams(location.search);
      const otherUserName = searchParams.get("channelname");
      if (otherUserName) {
        const response = await getChannelProfile(otherUserName);
        if (response) {
          //console.log("res: ", response.data?.data);
          setChannelProfile(response.data?.data);
        }
      } else if (userData?.userName) {
        const response = await getChannelProfile(userData?.userName);
        if (response) {
          //console.log("res: ", response.data?.data);
          setChannelProfile(response.data?.data);
        }
      } else {
        alert("please login, or select any channel to view");
      }
    } catch (error) {
      console.log("Error in channel.jsx: ", error);
      setError(error);
    }
  };

  const handleSubscribeClick = () => {
    if (authStatus) {
      console.log("login");
      setShowAlert(true);
      localStorage.setItem("alertShown", true);
    } else {
      console.log("not login");
      setShowAlert(true);
      localStorage.removeItem("alertShown");
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    localStorage.removeItem("alertShown");
  };

  return (
    <div className="w-full py-8">
      {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
      {showAlert && (
        <Stack
          sx={{ width: "100%", padding: "6px" }}
          spacing={4}
          alignItems="center"
          justifyContent="center"
        >
          <Alert
            severity={authStatus ? "success" : "error"}
            variant="filled"
            onClose={handleCloseAlert}
          >
            {authStatus ? "Subscribed Successfully." : "Please Login!"}
          </Alert>
        </Stack>
      )}
      <>
        <ChannelComponent
          email={channelProfile.email}
          channelName={channelProfile.userName}
          totalSubscribers={channelProfile.SubscriberCount}
          totalViews={channelProfile.totalViews}
          isSubscribed={channelProfile.isSubscriber}
          totalVideos={channelProfile.totalVideos}
          avatar={channelProfile.avatar}
          coverImage={channelProfile.coverImage}
          subscribeTo={channelProfile.channelSubscribedToCount}
          handleSubscribeClick={handleSubscribeClick}
          isAuthenticated={!!userData} // Check if the user is authenticated
          isOwner={userData?.userName === channelProfile.userName} // Check if the user owns the channel
        />
        <div className="py-6">
          {channelProfile._id && (
            <MyVideoComponent channelId={channelProfile._id} />
          )}
        </div>
      </>
    </div>
  );
};

export default Channel;
