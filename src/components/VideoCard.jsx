// VideoCard.jsx

import React from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import CommentIcon from "@mui/icons-material/Comment";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";

const VideoCard = ({
  thumbnail,
  videoFile,
  duration,
  views,
  title,
  Comments,
  Likes,
  isExpanded,
  setExpandedVideo,
}) => {
  const handleVideoClick = () => {
    setExpandedVideo((prevExpanded) =>
      prevExpanded === videoFile ? null : videoFile
    );
  };

  return (
    <div className={`relative ${isExpanded ? "col-span-full" : "col-span-1"}`}>
      <div className="p-2">
        <span className="text-black">
          {!isExpanded && `Video title: ${title}`}
        </span>
      </div>
      <div
        onClick={handleVideoClick}
        className="relative group overflow-hidden transition duration-300 transform hover:scale-105"
      >
        {isExpanded ? (
          <video className="w-full h-auto" controls>
            <source src={videoFile} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <>
            <img
              className="w-full h-40 object-cover transition duration-300 transform group-hover:scale-105"
              src={thumbnail}
              alt="Video Thumbnail"
            />
            <div className="p-2 absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white">
              <span>
                {duration} <AvTimerIcon />
              </span>
              <span className="ml-2">
                {views}
                <VisibilityIcon />
              </span>
              <span className="ml-2">
                {Comments}
                <CommentIcon />
              </span>
              <span className="ml-2">
                {Likes}
                <ThumbUpOffAltIcon />
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
