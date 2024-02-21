import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AvTimerIcon from "@mui/icons-material/AvTimer";

const VideoDialog = ({ open, handleClose, playlist }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 2;
  const totalPages = Math.ceil(playlist?.videos?.length / videosPerPage);
  const startIndex = (currentPage - 1) * videosPerPage;
  const endIndex = startIndex + videosPerPage;
  const currentVideos = playlist?.videos.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleCloseWithPagination = async () => {
    setCurrentPage(1);
    handleClose();
  };
  return (
    <Dialog open={open} onClose={handleCloseWithPagination}>
      <DialogTitle>Videos</DialogTitle>
      <DialogContent>
        {currentVideos && currentVideos.length > 0 ? (
          currentVideos.map(
            (video) =>
              video._id && (
                <div className="relative mb-6" key={video._id}>
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
  );
};

export default VideoDialog;
