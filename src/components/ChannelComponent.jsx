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
  const auhtStatus = useSelector((state) => state.auth.status);

  const handleClick = (event) => {
    if (!auhtStatus) {
      return alert("please login to view subscribers.");
    }
    setAnchorEl(event.currentTarget);
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
            <Grid item mt={4}>
              <Grid container direction="column" spacing={2}>
                <Grid item>
                  <Typography variant="h5">@{channelName}</Typography>
                </Grid>
                <Grid item>
                  {totalSubscribers > 0 ? (
                    <ButtonBase onClick={handleClick}>
                      <Typography className="underline">
                        Total Subscribers: {totalSubscribers}
                      </Typography>
                    </ButtonBase>
                  ) : (
                    <Typography>
                      Total Subscribers: {totalSubscribers}
                    </Typography>
                  )}
                </Grid>
                <Grid item>
                  <Typography variant="body1">
                    Total Views: {totalViews}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body1">
                    Total Videos: {totalVideos}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body1">
                    Subscribe To: {subscribeTo}
                  </Typography>
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
      />
    </Container>
  );
};

export default ChannelComponent;
