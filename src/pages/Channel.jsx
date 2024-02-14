import React, { useState, useEffect } from "react";
import { ChannelComponent } from "../components";
import { getChannelProfile } from "../apiAccess/auth";
import { useSelector } from "react-redux";

const Channel = () => {
  const [channelProfile, setChannelProfile] = useState({});
  const [error, setError] = useState("");
  const userData = useSelector((state) => state.auth.userData);
  const authStatus = useSelector((state) => state.auth.authStatus);

  useEffect(() => {
    if (userData) {
      fetchData(userData?.userName);
    }
  }, [userData]);

  const fetchData = async (username) => {
    try {
      if (username) {
        const response = await getChannelProfile(username);
        if (response) {
          //console.log("res: ", response.data?.data);
          setChannelProfile(response.data?.data);
        }
      }
    } catch (error) {
      console.log("Error in channel.jsx: ", error);
      setError(error);
    }
  };

  const handleSubscribeClick = () => {
    console.log("Hello");
    // Add your logic here
  };

  return (
    <div className="py-8">
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
      />
    </div>
  );
};

export default Channel;
