import React from "react";
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

const ChannelComponent = ({
  channelName,
  totalSubscribers,
  totalViews,
  totalVideos,
  isSubscribed,
  email,
  avatar,
  coverImage,
  subscribeTo,
  handleSubscribeClick,
}) => {
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
          <Avatar
            src={avatar}
            alt="Channel Avatar"
            sx={{ width: 200, height: 200 }}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color={isSubscribed ? "secondary" : "primary"}
            endIcon={isSubscribed ? <Favorite /> : <FavoriteBorder />}
            fullWidth
            onClick={handleSubscribeClick}
          >
            {isSubscribed ? "Unsubscribe" : "Subscribe"}
          </Button>
        </Grid>
      </Grid>

      {/* Body */}
      <Grid container spacing={2} mt={2}>
        <Grid item xs={12}>
          <Typography variant="h4">{channelName}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            Total Subscribers: {totalSubscribers}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">Total Views: {totalViews}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">Total Videos: {totalVideos}</Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChannelComponent;
