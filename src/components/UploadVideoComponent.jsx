import React, { useState } from "react";
import { useForm } from "react-hook-form";
import InputField from "./InputField";
import { useNavigate } from "react-router-dom";
import dbServiceObj from "../apiAccess/confYoutubeApi";
import { Logo } from "./index";
const UploadVideoComponent = ({ initialData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      thumbNail: initialData?.thumbNail || "",
      isPublished: initialData?.isPublished || false,
      videoFile: null,
    },
  });
  const navigate = useNavigate();
  const [btnClicked, setBtnClicked] = useState(false);
  const [error, setError] = useState();
  const onSubmit = async (data) => {
    setError("");
    if (initialData) {
      try {
        const videoId = initialData?._id;
        setBtnClicked(true);
        if (videoId) {
          const sendData = {
            title: data?.title || initialData?.title,
            description: data?.description || initialData?.description,
            thumbNail: data?.thumbNail || initialData?.thumbNail,
            isPublished:
              data?.isPublished !== undefined
                ? data.isPublished
                : initialData?.isPublished || false,
          };
          let checkCloudinary;

          if (typeof data === "object" && typeof data.thumbNail === "object") {
            checkCloudinary = false;
          } else {
            checkCloudinary = data.thumbNail.includes("res.cloudinary");
          }
          if (!checkCloudinary) {
            const [resThumbNail, resTitle] = await Promise.all([
              dbServiceObj.updateThumbnail(sendData, videoId),
              dbServiceObj.updateTitleDesc(sendData, videoId),
            ]);
          } else {
            const res = await dbServiceObj.updateTitleDesc(sendData, videoId);
          }

          setBtnClicked(false);
          navigate("/dashboard/my-videos");
        } else {
          setBtnClicked(false);
          setError("video id not found");
          console.log("video id not found");
        }
      } catch (error) {
        console.log("error in edit video, ", error);
        if (error.code === "ERR_NETWORK") {
          setError(
            "Network error. Please check your internet connection or server is up ?"
          );
        } else {
          const serverErrorMessage = error.response?.data?.match(
            /<pre>([\s\S]*?)<\/pre>/
          )?.[1];
          if (serverErrorMessage) {
            const splitContent = serverErrorMessage?.split("<br>");
            setError(
              splitContent
                ? splitContent[0].trim()
                : "An error occurred uploadvideo component"
            );
          } else {
            setError(
              error.response?.data?.message ||
                "An error occurred, no message, upload component"
            );
          }
        }
        setBtnClicked(false);
      }
    }
    /// for upload new video
    else {
      try {
        setBtnClicked(true);
        console.log("new video upload: ", data);
        const res = await dbServiceObj.uploadVideo(data);
        if (res?.data?.data) {
          navigate("/dashboard/my-videos");
        }
      } catch (error) {
        console.log("error in upload video componeent: ", error);
        if (error.code === "ERR_NETWORK") {
          setError(
            "Network error. Please check your internet connection or server is up ?"
          );
        } else {
          const serverErrorMessage = error.response?.data?.match(
            /<pre>([\s\S]*?)<\/pre>/
          )?.[1];
          if (serverErrorMessage) {
            const splitContent = serverErrorMessage?.split("<br>");
            setError(
              splitContent
                ? splitContent[0].trim()
                : "An error occurred uploadvideo component"
            );
          } else {
            setError(
              error.response?.data?.message ||
                "An error occurred, no message, upload component"
            );
          }
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}
      >
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="70px" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight mb-8">
          Upload Video 🎥
        </h2>
        {error && <p className="text-red-600 mt-8 mb-2 text-center">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap">
          <div className="w-full lg:w-1/2 pr-4 lg:border-r lg:border-gray-300">
            <div className="mb-4">
              <InputField
                label="Title"
                type="text"
                id="title"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="text-red-500">{errors.title.message}</p>
              )}
            </div>
            <div className="mb-4">
              <InputField
                label="Description"
                type="textarea"
                id="description"
                {...register("description", {
                  required: "description is required",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.description && (
                <p className="text-red-500">{errors.description.message}</p>
              )}
            </div>
            <div className="mb-4">
              <InputField
                label="isPublished"
                type="switch"
                id="isPublished"
                {...register("isPublished")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                checked={initialData ? initialData?.isPublished : false}
              />
            </div>

            {/* ... (similar blocks for description and videoName) */}
          </div>
          <div className="w-full lg:w-1/2 pl-4">
            <div className="mb-4">
              <InputField
                label={initialData ? "Update Video" : "Upload Video"}
                type="file"
                id="videoFile"
                {...register("videoFile", {
                  required: {
                    value: !initialData?.videoFile,
                    message: "Video File required",
                  },
                })}
                className="mb-4"
                accept="video/*"
              />
              {initialData && initialData?.videoFile && (
                <div className="w-full mb-4">
                  <video className="w-full h-auto" controls>
                    <source src={initialData.videoFile} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
              {errors.videoFile && (
                <p className="text-red-500">{errors.videoFile.message}</p>
              )}
            </div>
            <div className="mb-4">
              <InputField
                label={initialData ? "Update ThumbNail" : "Upload ThumbNail"}
                type="file"
                id="thumbNail"
                {...register("thumbNail", {
                  required: {
                    value: !initialData?.thumbNail,
                    message: "ThumbNail required",
                  },
                })}
                className="mb-4"
                accept="image/*"
              />
              {initialData && initialData.thumbNail && (
                <div className="w-full mb-4">
                  <img
                    src={initialData.thumbNail}
                    alt={initialData.title}
                    className="rounded-lg"
                  />
                </div>
              )}
              {errors.thumbNail && (
                <p className="text-red-500">{errors.thumbNail.message}</p>
              )}
            </div>

            {/* ... (similar block for thumbnailFile) */}
          </div>
          <div className="w-full mt-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-md"
              disabled={btnClicked}
            >
              {btnClicked ? "Wait..." : initialData ? "Update" : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadVideoComponent;
