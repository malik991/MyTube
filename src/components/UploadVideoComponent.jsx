import React from "react";
import { useForm } from "react-hook-form";
import InputField from "./InputField";
import { useNavigate } from "react-router-dom";
import dbServiceObj from "../apiAccess/confYoutubeApi";
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
      videoFile: null,
    },
  });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (initialData) {
      console.log("initial data present: ", initialData.thumbNail);
    } else {
      console.log("when new video upload: ", data);
      try {
        const res = await dbServiceObj.uploadVideo(data);
        if (res?.data?.data) {
          console.log("new video upload: ", res.data);
          navigate("/my-videos");
        }
      } catch (error) {
        console.log("error in upload video componeent: ", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex space-x-4">
      <div className="w-1/2 pr-4 border-r">
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
            type="text"
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

        {/* ... (similar blocks for description and videoName) */}
      </div>
      <div className="w-1/2 pl-4">
        <div className="flex flex-col">
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
      </div>
      <div className="w-full mt-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          {initialData ? "Update" : "Upload"}
        </button>
      </div>
    </form>
  );
};

export default UploadVideoComponent;
