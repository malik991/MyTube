import React, { useState, useEffect } from "react";
import {
  Popover,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { getSubscribersOfChannel } from "../apiAccess/auth";
import { Avatar } from "@mui/material";

const SubscribersPopover = ({ open, anchorEl, handleClose, channelId }) => {
  const id = open ? "simple-popover" : undefined;
  const [error, setError] = useState("");
  const [allSubscribers, setAllSubscribers] = useState(null);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      //console.log("chanel id: ", channelId);
      setError("");
      if (channelId) {
        const result = await getSubscribersOfChannel(channelId);
        console.log(result.data?.data);
        const { docs, totalDocs, totalPages } = result?.data?.data;
        setAllSubscribers(docs);
      }
    } catch (error) {
      console.log("Error in Subscriber popover: ", error);
      setError(error);
    }
  };

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      {allSubscribers ? (
        allSubscribers.map((channel) => (
          <List key={channel._id}>
            <ListItem>
              <ListItemText
                primary={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>
                      <Avatar
                        src={channel.subscriber.avatar}
                        sx={{ width: 30, height: 30 }}
                      />
                    </span>
                    <span className="ml-2">@</span>
                    <span className="underline text-lg text-green-600">
                      <a
                        href={`/channel?channelname=${channel.subscriber.userName}`}
                      >
                        {channel.subscriber.userName}
                      </a>
                    </span>
                  </div>
                }
              />
            </ListItem>
          </List>
        ))
      ) : (
        <List>
          <ListItem>
            <ListItemText primary="No subscriber available" />
          </ListItem>
        </List>
      )}
      {/* <List>
        <ListItem>
          <ListItemText primary="Clickable Item 1" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Clickable Item 2" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Clickable Item 3" />
        </ListItem>
      </List> */}
    </Popover>
  );
};

export default SubscribersPopover;
