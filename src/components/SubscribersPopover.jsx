import React, { useState, useEffect } from "react";
import {
  Popover,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  getSubscribersOfChannel,
  getChannelsSubscribeTo,
} from "../apiAccess/auth";
import { Avatar } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const SubscribersPopover = ({
  open,
  anchorEl,
  handleClose,
  channelId,
  linkType,
}) => {
  const id = open ? "simple-popover" : undefined;
  //console.log("link type: ", linkType);
  const [error, setError] = useState("");
  const [allSubscribers, setAllSubscribers] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (id) {
      fetchData(currentPage);
    }
  }, [id, currentPage]);

  const fetchData = async (page) => {
    try {
      //console.log("chanel id: ", channelId);
      setError("");
      if (channelId) {
        let result;
        if (linkType === "totalSubscribers") {
          result = await getSubscribersOfChannel(page, channelId);
        } else if (linkType === "subscribeTo") {
          result = await getChannelsSubscribeTo(page, channelId);
          //console.log("result: ", result.data);
        }

        const { docs, totalPages } = result?.data?.data;
        setAllSubscribers(docs);
        setTotalPages(totalPages);
      }
    } catch (error) {
      console.log("Error in Subscriber popover: ", error);
      setError(error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Custom handleClose handler to execute additional logic before closing
  const handleClosePopover = () => {
    handleClose(); // Close the popover in the parent component
    setCurrentPage(1); // Reset currentPage to 1
  };

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClosePopover}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      //sx={{ maxHeight: "80vh", overflowY: "auto" }} // Adjust the maxHeight and overflowY properties as needed
    >
      <div>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        {allSubscribers ? (
          <>
            {allSubscribers.map((channel) => (
              <List key={channel._id} sx={{ padding: 0 }}>
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
            ))}
            {totalPages > 1 && (
              <Stack spacing={2}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  size="small"
                  //variant="outlined"
                  color="secondary"
                  onChange={(event, page) => handlePageChange(page)}
                />
              </Stack>
            )}
          </>
        ) : (
          <List>
            <ListItem>
              <ListItemText primary="No subscriber available" />
            </ListItem>
          </List>
        )}
      </div>
    </Popover>
  );
};

export default SubscribersPopover;
