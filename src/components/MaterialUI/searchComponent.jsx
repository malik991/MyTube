import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import CircularDeterminate from "./CircularProgress";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import dbServiceObj from "../../apiAccess/confYoutubeApi";
import Pagination from "@mui/material/Pagination";
import { VideoCard } from "../index";
import { SimpleDividerLine } from "./DividerWithText";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "red",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function SearchVideos({ open, handleClose }) {
  // const [errorOccurred, setErrorOccurred] = useState(false);
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [getVideos, setVideos] = useState([]);
  const [expandedVideo, setExpandedVideo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    handleSearch(currentPage);
  }, [currentPage]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };
  // Function to handle search action
  const handleSearch = async (page) => {
    setApiError("");
    //console.log("Search value:", searchValue); // Replace with your desired action
    if (expandedVideo) {
      //console.log("fetch data");
      setExpandedVideo(null); // to remove the expanded video from next page
    }
    if (searchValue) {
      try {
        const res = await dbServiceObj.getAllVideos(
          "title",
          "desc",
          null,
          page,
          searchValue
        );
        if (res) {
          if (res.data?.data?.docs?.length === 0) {
            setApiError("result not found");
            setVideos([]);
          } else {
            const { docs, totalPages } = res.data?.data;
            setVideos(docs);
            setTotalPages(totalPages);
          }
        }
      } catch (error) {
        console.log("error in search: ", error);
        setApiError(error?.response?.data?.message || "error in search");
      }
    } else {
      setApiError("please write something to search.");
    }
  };

  const handleChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const rearrangedVideos = expandedVideo
    ? [
        {
          ...getVideos.find((video) => video.videoFile === expandedVideo),
          uniqueKey: "expanded",
        },
        ...getVideos.filter((video) => video.videoFile !== expandedVideo),
      ]
    : getVideos;

  return (
    <React.Fragment>
      <Dialog fullWidth maxWidth="lg" open={open} onClose={handleClose}>
        <DialogTitle>search videos by title and description</DialogTitle>
        {apiError && (
          <p style={{ color: "red", textAlign: "center" }}>{apiError}</p>
        )}

        <DialogContent>
          <Box
            noValidate
            // component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              m: "auto",
              width: "fit-content",
            }}
          >
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search here...."
                inputProps={{ "aria-label": "search" }}
                onChange={handleChange}
                value={searchValue}
                onKeyDown={handleKeyDown}
              />
            </Search>
            <div className=" py-4">
              {getVideos.length > 0 && (
                <SimpleDividerLine labelText="Search Result" />
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {rearrangedVideos.map((video) => (
                <VideoCard
                  key={video.uniqueKey || video.videoFile}
                  thumbnail={video.thumbNail}
                  videoFile={video.videoFile}
                  duration={video.duration}
                  views={video.views}
                  title={video.title}
                  description={video.description}
                  Comments={video.totalComments}
                  Likes={video.totalLikes}
                  videoId={video._id}
                  fullName={video.owner?.fullName}
                  ownerAvatar={video.owner.avatar}
                  channelName={video.owner.userName}
                  isExpanded={expandedVideo === video.videoFile}
                  setExpandedVideo={setExpandedVideo}
                />
              ))}
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={currentPage}
          size="large"
          color="secondary"
          onChange={(event, page) => handlePageChange(page)}
        />
      )}
    </React.Fragment>
  );
}
