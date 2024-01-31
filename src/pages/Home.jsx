import React, { useEffect, useState } from "react";
import dbServiceObj from "../apiAccess/confYoutubeApi";
import { VideoCard, Container, Button } from "../components";

function Home() {
  const [getVideos, setVideos] = useState([]);
  const [getTotalVideos, setTotalVideos] = useState(null);
  const [expandedVideo, setExpandedVideo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [btnClicked, setBtnClicked] = useState(false);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page) => {
    try {
      if (expandedVideo) {
        //console.log("fetch data");
        setExpandedVideo(null); // to remove the expanded video from next page
      }
      const response = await dbServiceObj.getAllVideos(
        "title",
        "desc",
        null,
        page
      );
      const { docs, totalDocs, totalPages } = response.data.data;
      // console.log(
      //   `docs: ${docs}, totalDocs: ${totalDocs}, totalPages: ${totalPages}`
      // );
      setVideos(docs);
      setTotalVideos(totalDocs);
      setTotalPages(totalPages);
    } catch (error) {
      console.log("Error fetching videos:", error);
    }
  };

  const handlePageChange = (newPage) => {
    setBtnClicked(true);
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // rearrangedVideos array includes an object if expandedVideo is truthy it append a flag
  // of unique key with that record, and remainng videos are filter, due to
  // ... operator expanded video will remain at the top of the array
  const rearrangedVideos = expandedVideo
    ? [
        {
          ...getVideos.find((video) => video.videoFile === expandedVideo),
          uniqueKey: "expanded",
        },
        ...getVideos.filter((video) => video.videoFile !== expandedVideo),
      ]
    : getVideos;
  // console.log("expendedVideo: ", expandedVideo);

  return (
    <div className="w-full py-8">
      <h1>Total Videos: {getTotalVideos}</h1>
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {rearrangedVideos.map((video) => (
            <VideoCard
              key={video.uniqueKey || video.videoFile}
              thumbnail={video.thumbNail}
              videoFile={video.videoFile}
              duration={video.duration}
              views={video.views}
              title={video.title}
              Comments={video.totalComments}
              Likes={video.totalLikes}
              videoId={video._id}
              isExpanded={expandedVideo === video.videoFile} // if expen equal to videoFile
              setExpandedVideo={setExpandedVideo}
            />
          ))}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <Button
              className={`px-4 py-2 mx-2 ${
                btnClicked && currentPage !== 1
                  ? "bg-red-600 text-white text-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed text-lg"
              }`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
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
              Next -{`>`}
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
}

export default Home;
