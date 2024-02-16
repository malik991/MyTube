import React, { useState, useEffect } from "react";
import { ChannelComponent, MyVideoComponent } from "../components";
import { getChannelProfile, toggledSubscription } from "../apiAccess/auth";
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
  const [getSubscription, setSubscription] = useState(false);
  const [getSubscriptionMsg, setSubscriptionMsg] = useState("");
  const location = useLocation();

  useEffect(() => {
    fetchData();
    ///
  }, [location.search, getSubscription]);

  const fetchData = async () => {
    try {
      setError("");
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

  const handleSubscribeClick = async () => {
    try {
      setError("");
      if (authStatus) {
        console.log("login");
        if (channelProfile?.userName) {
          const res = await toggledSubscription(channelProfile.userName);
          if (res) {
            setSubscription(!channelProfile.isSubscriber);
            setSubscriptionMsg(res.data.message);
            //console.log(res.data.message);
          }
        }

        setShowAlert(true);
        localStorage.setItem("alertShown", true);
      } else {
        console.log("not login");
        setShowAlert(true);
        localStorage.removeItem("alertShown");
      }
    } catch (error) {
      console.log("error while subscribe: ", error);
      setError(error);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    localStorage.removeItem("alertShown");
  };

  return (
    <div className="w-full py-8">
      {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

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
              {authStatus ? getSubscriptionMsg : "Please Login!"}
            </Alert>
          </Stack>
        )}
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
