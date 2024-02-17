import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  Avatar,
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import LinkButton from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import SubscribersPopover from "./SubscribersPopover";
import { useSelector } from "react-redux";

const ChannelComponent = ({
  channelName,
  totalSubscribers,
  totalViews,
  totalVideos,
  isSubscribed,
  email,
  channelId,
  avatar,
  coverImage,
  subscribeTo,
  handleSubscribeClick,
  isAuthenticated,
  isOwner,
}) => {
  //console.log("channel id: ", channelId, " isOwner: ", isOwner);
  const [anchorEl, setAnchorEl] = useState(null);
  const [linkType, setLinkType] = useState(null); // State to track linkType
  const auhtStatus = useSelector((state) => state.auth.status);

  const handleClick = (event, linkType) => {
    if (!auhtStatus) {
      if (linkType === "totalSubscribers") {
        return alert("please login to view subscribers.");
      } else if (linkType === "subscribeTo") {
        return alert("please login to view Subscribed To.");
      }
    }
    setAnchorEl(event.currentTarget);
    setLinkType(linkType);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Container>
      {/* Hero Header */}
      <Card>
        <CardMedia
          component="img"
          style={{ height: 300, width: "100%", objectFit: "cover" }} // Adjust the height and width as needed
          image={coverImage}
          alt="Channel Cover Image"
        />
      </Card>
      <Grid container alignItems="center" justifyContent="space-between" p={3}>
        <Grid item>
          <Grid container direction="row" spacing={8}>
            <Grid item>
              <Avatar
                src={avatar}
                alt="Channel Avatar"
                sx={{ width: 220, height: 220 }}
              />
            </Grid>

            {/* Body */}
            <Grid item mt={2}>
              <Grid container direction="column" spacing={1}>
                <Grid item textAlign={"left"}>
                  <Typography variant="h5">@{channelName}</Typography>
                </Grid>
                <Grid item textAlign={"left"}>
                  {totalSubscribers > 0 ? (
                    <ButtonBase
                      onClick={(event) =>
                        handleClick(event, "totalSubscribers")
                      }
                    >
                      <Typography
                        className="underline"
                        sx={{
                          fontSize: "1.2rem", // You can adjust the font size as needed
                          fontWeight: "bold", // Add other styles as needed
                          color: "red", // Apply text color
                        }}
                      >
                        Total Subscribers: {totalSubscribers}
                      </Typography>
                    </ButtonBase>
                  ) : (
                    <Typography>
                      Total Subscribers: {totalSubscribers}
                    </Typography>
                  )}
                </Grid>
                <Grid item textAlign={"left"}>
                  <Typography variant="body1">
                    Total Views: {totalViews}
                  </Typography>
                </Grid>
                <Grid item textAlign={"left"}>
                  <Typography variant="body1">
                    Total Videos: {totalVideos}
                  </Typography>
                </Grid>
                <Grid item textAlign={"left"}>
                  {subscribeTo > 0 ? (
                    <ButtonBase
                      onClick={(event) => handleClick(event, "subscribeTo")}
                    >
                      <Typography
                        className="underline"
                        sx={{
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                          color: "red",
                        }}
                      >
                        Subscribed To: {subscribeTo}
                      </Typography>
                    </ButtonBase>
                  ) : (
                    <Typography>Subscriberd To: {subscribeTo}</Typography>
                  )}
                </Grid>
                <Grid item textAlign={"left"}>
                  <Typography variant="body1">contact: {email}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {isOwner && (
          <Grid item>
            <Grid container direction="column" spacing={1}>
              <Grid item>
                <LinkButton variant="outlined" fullWidth href="/upload-video">
                  Upload Video
                </LinkButton>
              </Grid>
              <Grid item>
                <LinkButton variant="outlined" fullWidth href="/profile">
                  Edit Profile
                </LinkButton>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
      {/* Subscriber Button */}
      {!isOwner && (
        <Grid container justifyContent="flex-end">
          <Button
            variant="contained"
            color={isSubscribed ? "secondary" : "primary"}
            endIcon={isSubscribed ? <Favorite /> : <FavoriteBorder />}
            onClick={handleSubscribeClick}
          >
            {isSubscribed ? "Unsubscribe" : "Subscribe"}
          </Button>
        </Grid>
      )}
      <SubscribersPopover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        handleClose={handleClose}
        channelId={channelId}
        linkType={linkType}
      />
    </Container>
  );
};

export default ChannelComponent;
