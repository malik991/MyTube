// VideoCard.jsx

import React, { useRef, useState, useEffect } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import CommentIcon from "@mui/icons-material/Comment";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import dbServiceObj from "../apiAccess/confYoutubeApi";
import { addWatchHistory } from "../apiAccess/auth";
import { useSelector, useDispatch } from "react-redux";
import { InputField, Button } from "../components";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import MenuComponent from "./MaterialUI/MenuComponent";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import DownloadIcon from "@mui/icons-material/Download";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import ConfirmationDialog from "./MaterialUI/ConfirmationDialog";
import AddToPlaylistDialog from "./MaterialUI/AddToPlaylistDialog";
import { closeSnackbar } from "../store/snackbarSlice";
import CustomSnackbar from "./CustomSnackbar";
const VideoCard = ({
  thumbnail,
  videoFile,
  duration,
  views,
  title,
  Comments,
  fullName,
  ownerAvatar,
  channelName,
  videoId,
  owner,
  isExpanded,
  setExpandedVideo,
}) => {
  //console.log("chnal: ", channelName);
  const videoRef = useRef(null);
  const [videoComments, setVideoComments] = useState([]);
  const [userComment, setUserComment] = useState("");
  const [totalComment, setTotalComment] = useState("");
  const [videoLikes, setVideoLikes] = useState(0);
  const [btnClicked, setBtnClicked] = useState(false);
  const [pageBtnClicked, setPageBtnClicked] = useState(false);
  const [likedBtn, setLikedBtn] = useState(false);
  const [deleteBtn, setDeleteBtn] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(false);
  const { message } = useSelector((state) => state.snackbar);
  const dispatch = useDispatch();

  const [hovered, setHovered] = useState(false);
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const { register, handleSubmit, formState } = useForm({}); //shouldUnregister: true,
  const { errors: hookErrors } = formState;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [addToPlaylistOpen, setAddToPlaylistOpen] = useState(false);
  // check the owner and logged in user
  let isOwnerMatched = false;
  if (owner) {
    isOwnerMatched = owner === userData?.id;
  }
  useEffect(() => {
    fetchData(currentPage); // Call the fetchData function when the component mounts
  }, [videoId, btnClicked, likedBtn, currentPage, deleteStatus]);
  const fetchData = async (page) => {
    try {
      if (videoId) {
        const commentsData = await dbServiceObj.getCommentsByVideoId(
          videoId,
          page
        );
        const likesData = await dbServiceObj.getLikesByVideoId(videoId);
        //console.log("total like", likesData?.data?.data[0]?.totalLikes);
        setVideoComments(commentsData?.data?.data.docs || []);
        setVideoLikes(likesData?.data?.data[0]?.totalLikes || 0);
        const { totalDocs, totalPages } = commentsData.data.data;
        setTotalPages(totalPages);
        setTotalComment(totalDocs);
      }
    } catch (error) {
      console.log("Error in Video Card.jsx useEffect:: ", error);
    }
  };

  const handlePageChange = (newPage) => {
    setPageBtnClicked(true);
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  const handleVideoClick = async (e) => {
    //console.log("btn clicked");
    if (
      e.target.tagName.toLowerCase() === "input" ||
      e.target.tagName.toLowerCase() === "button" ||
      isExpanded
    ) {
      // If the click happened inside an input or button, do nothing

      return;
    }
    try {
      //console.log("view update");
      const views = await dbServiceObj.getVideoViews(videoId);
      if (authStatus) {
        const response = await addWatchHistory(videoId);
      }
    } catch (error) {
      console.log("error in video card while click on video for view: ", error);
    }
    setExpandedVideo((prevExpanded) =>
      prevExpanded === videoFile ? null : videoFile
    );
    // Scroll to the expanded video
    if (videoRef.current) {
      e.preventDefault();
      videoRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "end",
      });
    }
  };

  const handleCommentChange = (e) => {
    e.stopPropagation();
    if (!authStatus) {
      alert("please login for enter comment");
    } else {
      setUserComment(e.target.value);
      //setValue("comment", e.target.value);
    }
  };

  const handleCommentSubmit = async (e) => {
    // Implement logic to submit the user's comment to the backend
    //e.preventDefault();
    setBtnClicked(true);
    try {
      //console.log("comment  ", userComment, " video ", videoId);
      const res = await dbServiceObj.addComment(userComment, videoId);

      if (res && res?.data) {
        const newComment = {
          owner: res.data.owner,
          content: userComment,
        };
        setVideoComments((prevComments) => [...prevComments, newComment]);
        setUserComment(""); // Clear the comment input field
      } else {
        console.error("Error: Unable to add comment");
      }
    } catch (error) {
      console.log("error: while submir comment in videoCard: ", error);
    } finally {
      setBtnClicked(false);
    }
  };

  const handleLikeClick = async () => {
    // Implement logic to submit the user's like to the backend
    if (!authStatus) {
      alert("please login for like the video");
    } else {
      setLikedBtn(!likedBtn);
      try {
        const res = await dbServiceObj.toggleVideoLikes(videoId);
        if (res && res.data.data) {
          const { likedBy } = res.data.data;
          //console.log("likedBy", likedBy);
          setVideoLikes((prevLikes) =>
            likedBy ? prevLikes + 1 : prevLikes - 1
          );
        } else {
          console.error("Error: Unable to toggle video likes, please login");
        }
      } catch (error) {
        console.log("error while like or dislike the video", error);
      }
    }

    // and update the like count
  };

  const handleDeleteVideo = async (e) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this video?"
    );
    if (confirmDelete) {
      // User clicked OK, proceed with deletion
      setDeleteBtn(true);
      try {
        //console.log("delete called", videoId);
        if (videoId) {
          await dbServiceObj.deleteVideo(videoId);
        }
        setDeleteBtn(false);
        setDeleteStatus(true);
        navigate("/");
      } catch (error) {
        console.log("error deleting video from VideoCard: ", error);
        setDeleteBtn(false);
        setDeleteStatus(false);
      }
    } else {
      // User clicked Cancel, do nothing
      console.log("Deletion cancelled");
    }
  };

  /// menu items
  const handleAddToPlaylist = () => {
    // Logic to add video to playlist
    if (authStatus) {
      //console.log("Video added to playlist");
      setAddToPlaylistOpen(true);
    } else {
      setConfirmationOpen(true);
    }
  };

  const handleOtherAction = () => {
    // Other action logic
    console.log("Other action executed");
  };

  const handleCloseSnackBar = () => {
    dispatch(closeSnackbar());
  };

  const menuItems = [
    {
      label: "Add to Playlist",
      icon: <PlaylistAddIcon />,
      onClick: handleAddToPlaylist,
    },
    {
      label: "Download",
      icon: <DownloadIcon />,
      onClick: handleOtherAction,
    },
    {
      label: "Cut",
      icon: <ContentCutIcon />,
      onClick: handleOtherAction,
    },
    // Add more menu items as needed
  ];

  const handleConfirm = () => {
    // Handle confirmation action, like navigating to login page
    navigate("/login");
    setConfirmationOpen(false); // Close the dialog after confirmation
  };

  const handleClose = () => {
    // Close the dialog without taking any action
    setConfirmationOpen(false);
  };

  return (
    <div
      ref={videoRef}
      className={`relative ${isExpanded ? "col-span-full" : "col-span-1"}`}
    >
      <div
        // onClick={handleVideoClick}
        className="relative group overflow-hidden transition duration-300 transform hover:scale-105"
      >
        {isExpanded ? (
          <>
            {message && (
              <div className=" flex justify-center items-center py-2">
                <CustomSnackbar handleClose={handleCloseSnackBar} />
              </div>
            )}
            <video className="w-full h-auto" controls>
              <source src={videoFile} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="p-2">
              <div className="p-2 bottom-0 left-0 right-0 bg-gray-500 bg-opacity-50 text-white flex justify-between items-center">
                <div className="text-left">
                  <span className="ml-2">
                    {videoLikes} <ThumbUpOffAltIcon />
                  </span>
                  <span className="ml-2">
                    {totalComment} <CommentIcon />
                  </span>
                  <span className="ml-2">
                    <VisibilityIcon /> {views}
                  </span>
                </div>
                <div className="flex items-end ">
                  <button
                    onClick={handleLikeClick}
                    className={`transition-colors mr-4 ${
                      likedBtn ? "text-red-500" : "text-black"
                    }`}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                  >
                    <Tooltip title="Like / disLike">
                      <ThumbUpOffAltIcon />
                    </Tooltip>

                    {/* {hovered && !likedBtn && " Like this video"} */}
                  </button>
                  <MenuComponent menuItems={menuItems} />
                </div>
              </div>
              <div>
                {videoComments.map((comment, index) => (
                  <div key={index}>
                    <strong>{comment.owner?.fullName}:</strong>{" "}
                    {comment.content}
                  </div>
                ))}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-4">
                    <Button
                      className={`px-4 py-2 mx-2 ${
                        pageBtnClicked && currentPage !== 1
                          ? "bg-red-600 text-white text-lg"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed text-lg"
                      }`}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      {`<-`}
                    </Button>
                    <Button
                      className={`px-4 py-2 mx-2 ${
                        currentPage === totalPages
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed text-lg"
                          : "bg-blue-600 text-white text-lg"
                      }`}
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      {`>`}
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <form
                  className="mt-8"
                  onSubmit={handleSubmit(handleCommentSubmit)}
                  noValidate
                >
                  <div className="space-y-5">
                    <InputField
                      label="Comment:"
                      placeholder="Enter your commnet!"
                      value={userComment}
                      type="text"
                      {...register("comment", {
                        required: "please write your comment, before submit",
                      })}
                      onChange={handleCommentChange}
                    />
                    {hookErrors.comment?.message && (
                      <p className="text-red-600 text-sm text-left mt-0 mb-0">
                        {hookErrors.comment.message}
                      </p>
                    )}

                    <Button type="submit" disabled={btnClicked}>
                      {btnClicked ? "Wait..." : "Submit"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="">
              <Typography
                variant="subtitle1"
                color="textPrimary"
                component="div"
              >
                <h2 className="text-black text-lg font-semibold from-stone-100 font-serif">
                  Title: {title}
                </h2>
              </Typography>
            </CardContent>
            <CardActionArea>
              <CardMedia
                className="w-full h-60 object-cover"
                component="img"
                alt="Video Thumbnail"
                height="140"
                image={thumbnail}
                title="Video Thumbnail"
                onClick={(e) => handleVideoClick(e)}
              />
              <CardContent className="bg-gray-100">
                <Typography variant="body2" color="textSecondary" component="p">
                  {duration} <AvTimerIcon />
                  {views} <VisibilityIcon />
                  {Comments} <CommentIcon />
                  {videoLikes} <ThumbUpOffAltIcon />
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardContent className="bg-gray-100">
              <Typography variant="body2" color="textSecondary" component="p">
                Creator:
              </Typography>
              <Avatar
                src={ownerAvatar}
                alt="Owner Avatar"
                sx={{ width: 40, height: 40 }}
              />
              <Typography variant="body2" color="textSecondary" component="p">
                <a
                  className="text-xl font-semibold text-purple-500 underline"
                  href={`/channel?channelname=${channelName}`}
                >
                  Visit @{channelName}
                </a>
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {fullName}
              </Typography>
              <MenuComponent menuItems={menuItems} />
            </CardContent>
          </Card>
        )}
      </div>
      {!isExpanded && isOwnerMatched && (
        <div className="py-2">
          <span>
            <Link to={`/upload-video/${videoId}`}>
              <Button className="bg-green-500">Edit</Button>
            </Link>
          </span>
          <span className="ml-2">
            <Button
              onClick={handleDeleteVideo}
              disabled={deleteBtn}
              className="bg-red-600"
            >
              {deleteBtn ? "Wait.." : "Delete"}
            </Button>
          </span>
        </div>
      )}
      <ConfirmationDialog
        open={confirmationOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title="Login Required"
        message="You need to login to add this video to your playlist. Do you want to proceed to login?"
      />
      {addToPlaylistOpen && (
        <AddToPlaylistDialog
          open={addToPlaylistOpen}
          onClose={() => setAddToPlaylistOpen(false)}
          videoId={videoId}
        />
      )}
    </div>
  );
};

export default VideoCard;
