import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Avatar,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { useSelector, useDispatch } from "react-redux";
import { fetchPlayLists } from "../../store/playListSlice";
import Pagination from "@mui/material/Pagination";
import VideoDialog from "./VideoDialog";

const PlaylistCard = ({ loading }) => {
  const { userPlayLists, status, error, totalPages } = useSelector(
    (state) => state.playlist
  );
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page) => {
    try {
      dispatch(fetchPlayLists(page));
    } catch (error) {
      console.log("Error in PlayList card: ", error);
    }
  };

  const handleCardClick = (playlist) => {
    setSelectedPlaylist(playlist);
    setDialogOpen(true);
  };
  const handleUploadCoverImage = (playlist) => {
    // Handle card click event
    console.log("Clicked playlist:", playlist);
    // You can set state to display video IDs here
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex flex-wrap justify-center items-center">
          <Stack spacing={1}>
            {/* For variant="text", adjust the height via font-size */}
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
            {/* For other variants, adjust the size with `width` and `height` */}
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="rectangular" width={210} height={60} />
            <Skeleton variant="rounded" width={210} height={60} />
          </Stack>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {userPlayLists?.docs?.map((playlist) => (
            <div
              className="relative group overflow-hidden transition duration-300 transform hover:scale-105"
              key={playlist._id}
              onClick={() => handleCardClick(playlist)}
              style={{ cursor: "pointer" }}
            >
              <Card className="border border-purple-200">
                <CardHeader
                  className="bg-cyan-200"
                  avatar={
                    <Avatar
                      src={playlist.owner.avatar}
                      alt="Owner Avatar"
                      sx={{ width: 40, height: 40 }}
                    />
                  }
                  title={playlist.name}
                  subheader={playlist.description}
                />
                <CardMedia
                  style={{
                    height: playlist.coverImage ? "250px" : "0", // Adjust the height based on the presence of cover image
                    paddingTop: playlist.coverImage ? "0" : "56.25%", // Set the padding top dynamically
                    position: "relative",
                  }}
                  title={playlist.name}
                >
                  {playlist.coverImage ? (
                    <img
                      src={playlist.coverImage}
                      alt={playlist.name}
                      style={{
                        //padding: "1px",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <IconButton
                        onClick={() => handleUploadCoverImage(playlist)}
                      >
                        <AddPhotoAlternateIcon />
                      </IconButton>
                    </div>
                  )}
                </CardMedia>
                <CardContent className="bg-slate-400">
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Click the card to view videos in this playlist.
                  </Typography>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-center mt-4">
        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={currentPage}
            size="large"
            color="secondary"
            onChange={(event, page) => handlePageChange(page)}
          />
        )}
      </div>
      <VideoDialog
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        playlist={selectedPlaylist}
      />
    </>
  );
};

export default PlaylistCard;
