// VideoCard.jsx

import React from "react";

const VideoCard = ({
  thumbnail,
  videoFile,
  duration,
  views,
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
      <div onClick={handleVideoClick}>
        {isExpanded ? (
          <video className="w-full h-auto" controls>
            <source src={videoFile} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <>
            <img
              className="w-full h-auto"
              src={thumbnail}
              alt="Video Thumbnail"
            />
            <div className="p-2 absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white">
              <span>{duration} seconds</span>
              <span className="ml-2">{views} views</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
