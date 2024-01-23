import React, { useEffect, useState } from "react";
import dbServiceObj from "../apiAccess/confYoutubeApi";
import { VideoCard, Container } from "../components";

function Home() {
  const [getVideos, setVideos] = useState([]);
  const [getTotalVideos, setTotalVideos] = useState(null);
  const [expandedVideo, setExpandedVideo] = useState(null);

  useEffect(() => {
    dbServiceObj
      .getAllVideos()
      .then((allVideos) => {
        if (allVideos.status === 200) {
          setVideos(allVideos.data.data.docs);
          setTotalVideos(allVideos.data.data.totalDocs);
        } else {
          console.log("No data fetched");
        }
      })
      .catch((err) => {
        console.log("Error in App useEffect", err);
      });
  }, []);

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
    <div className="w-full py-8">
      <h1>Total Videos: {getTotalVideos}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {rearrangedVideos.map((video) => (
          <VideoCard
            key={video.uniqueKey || video.videoFile}
            thumbnail={video.thumbNail}
            videoFile={video.videoFile}
            duration={video.duration}
            views={video.views}
            isExpanded={expandedVideo === video.videoFile}
            setExpandedVideo={setExpandedVideo}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
