import React, { useState, useEffect } from "react";
import { Container, UploadVideoComponent } from "../components";
import { useParams } from "react-router-dom";
import dbServiceObj from "../apiAccess/confYoutubeApi";

const EditVideo = () => {
  const [load, setLoad] = useState(null);
  const { videoId } = useParams();

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        if (videoId) {
          const res = await dbServiceObj.getVideoById(videoId);
          if (res?.data) {
            //console.log(res.data.data);
            setLoad(res?.data?.data);
          }
        }
      } catch (error) {
        console.log("Error in EditVideo.jsx : ", error);
      }
    };

    fetchVideoData();
  }, [videoId]);

  return load ? (
    <div className="py-8">
      <Container>
        <UploadVideoComponent initialData={load} />
      </Container>
    </div>
  ) : (
    <p>video not fetched in EditVideo.jsx please check</p>
  );
};

export default EditVideo;
