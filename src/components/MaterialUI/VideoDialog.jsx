import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationDialog from "./ConfirmationDialog";
import dbServiceObj from "../../apiAccess/confYoutubeApi";
import { useDispatch, useSelector } from "react-redux";
import { openSnackbar, closeSnackbar } from "../../store/snackbarSlice";
import CustomSnackbar from "../CustomSnackbar";
import { BootstrapTooltips } from "./CustomizedTooltips";

const VideoDialog = ({ open, handleClose, playlist, onSuccess }) => {
  //console.log("playlist video Dialog: ", playlist);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletingVideoId, setdeletingVideoId] = useState("");
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const { message } = useSelector((state) => state.snackbar);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);

  const [cusError, setCusError] = useState("");
  const videosPerPage = 3;
  const totalPages = Math.ceil(currentPlaylist?.videos?.length / videosPerPage);
  const startIndex = (currentPage - 1) * videosPerPage;
  const endIndex = startIndex + videosPerPage;
  const currentVideos = currentPlaylist?.videos.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPlaylist(playlist); // Update the current playlist data when playlist prop changes
  }, [playlist]);
  //console.log("Curent video Dialog: ", currentPlaylist);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleOpenDeleteDialog = (videoId) => {
    setOpenDeleteDialog(true);
    setdeletingVideoId(videoId);
  };
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async (deletingVideoId, playlistId) => {
    // console.log("video Id: ", deletingVideoId, "playlistID: ", playlistId);
    try {
      setCusError("");
      setLoading(true);
      const result = await dbServiceObj.deleteVideoFromPlaylist(
        deletingVideoId,
        playlistId
      );
      if (result) {
        dispatch(openSnackbar(`Video deleted successfully.😊`));
        onSuccess();
        setCurrentPage(1);
        handleClose();
      }
    } catch (error) {
      console.log("Error delete video from playlist videoDialog.jsx: ", error);
      setLoading(false);
      setCusError(error.response?.data?.message);
    } finally {
      setLoading(false);
      handleCloseDeleteDialog();
    }
  };

  const handleCloseWithPagination = async () => {
    setCurrentPage(1);
    handleClose();
  };

  const handleCloseSnackBar = () => {
    dispatch(closeSnackbar());
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <>
      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <Dialog open={open} onClose={handleCloseWithPagination}>
          <DialogTitle>Videos</DialogTitle>
          {message && (
            <div className=" flex justify-center items-center py-2">
              <CustomSnackbar handleClose={handleCloseSnackBar} />
            </div>
          )}
          {cusError && (
            <p style={{ color: "red", textAlign: "center" }}>{cusError}</p>
          )}
          <DialogContent>
            {currentVideos && currentVideos.length > 0 ? (
              currentVideos.map(
                (video) =>
                  video._id && (
                    <div className="relative mb-6" key={video._id}>
                      <BootstrapTooltips title="Delete Video">
                        <DeleteIcon
                          className="absolute top-0 right-0 cursor-pointer"
                          style={{
                            color: isHovered ? "blue" : "red",
                            fontSize: "24px",
                          }}
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                          onClick={() => handleOpenDeleteDialog(video?._id)}
                        />
                      </BootstrapTooltips>

                      {openDeleteDialog && deletingVideoId && (
                        <ConfirmationDialog
                          open={openDeleteDialog}
                          onClose={handleCloseDeleteDialog}
                          onConfirm={() =>
                            handleConfirmDelete(
                              deletingVideoId,
                              currentPlaylist?._id
                            )
                          }
                          title="Confirm Deletion"
                          message="Are you sure you want to delete this Video?"
                        />
                      )}

                      <Typography
                        variant="h5"
                        component="h2"
                        className="text-xl font-serif font-bold text-center"
                      >
                        {video.title}
                      </Typography>
                      <Typography className="text-center">
                        {video.description}
                      </Typography>
                      <div className="relative">
                        <video controls className="w-full">
                          <source src={video.videoFile} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        <div className="absolute bottom-0 left-0 right-0 bg-gray-500 bg-opacity-50 text-white flex justify-between items-center p-2">
                          <div className="text-left">
                            <span className="ml-2">
                              {video.duration} <AvTimerIcon />
                            </span>
                            <span className="ml-2">
                              {video.views} <VisibilityIcon />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
              )
            ) : (
              <Typography>No videos found</Typography>
            )}
          </DialogContent>

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
          <DialogActions>
            <Button onClick={handleCloseWithPagination}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default VideoDialog;
