import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  updateCoverImage,
  updateUserDetails,
  updateAvatar,
} from "../apiAccess/auth";
import { Logo, InputField, SidePanel, ImageUploadField } from "./index";
import { CardMedia, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import { login as authLogin } from "../store/authSlice";
import BackdropMUI from "./MaterialUI/BackDrop";
import { openSnackbar, closeSnackbar } from "../store/snackbarSlice";
import CustomSnackbar from "./CustomSnackbar";
import { BootstrapTooltips } from "./MaterialUI/CustomizedTooltips";

const ProfileComponent = ({ initialData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: initialData?.id || "",
      userName: initialData?.userName || "",
      email: initialData?.email || "",
      fullName: initialData?.fullName || "",
      existedAvatar: initialData?.avatar || "",
      coverImage: initialData?.coverImage || "",
    },
  });

  const { message } = useSelector((state) => state.snackbar);
  const navigate = useNavigate();
  const [coverImage, setCoverImage] = useState("");
  const [openBackdropDialog, setOpenBackdropDialog] = useState(false);

  const [updatedAvatar, setupdatedAvatar] = useState("");
  const [btnClicked, setBtnClicked] = useState(false);
  const [customError, setCustomError] = useState();
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setCoverImage(initialData?.coverImage);
    setupdatedAvatar(initialData?.Avatar);
  }, [initialData]);

  //console.log("initial data: ", initialData);

  const onSubmit = async (userProfileData) => {
    setCustomError("");
    setOpenBackdropDialog(true);
    userProfileData.updatedAvatar = updatedAvatar;
    try {
      setBtnClicked(true);
      if (userProfileData?.updatedAvatar) {
        const { existedAvatar, ...dataToSend } = userProfileData;
        const [resAvatar, resUserDetail] = await Promise.all([
          updateAvatar(dataToSend.updatedAvatar),
          updateUserDetails(dataToSend),
        ]);
        if (resUserDetail && resAvatar) {
          const updateReduxData = {
            id: resUserDetail.data?.data?._id,
            userName: resUserDetail.data?.data?.userName,
            email: resUserDetail.data?.data?.email,
            fullName: resUserDetail.data?.data?.fullName,
            avatar: resUserDetail.data?.data?.avatar,
            coverImage: resUserDetail.data?.data?.coverImage,
          };
          dispatch(authLogin(updateReduxData));
          dispatch(openSnackbar(`Detail and Avatar Updated successfully. 😊`));
        }

        navigate("/");
      } else {
        const result = await updateUserDetails(userProfileData);
        if (result) {
          const updateReduxData = {
            id: result.data?.data?._id,
            userName: result.data?.data?.userName,
            email: result.data?.data?.email,
            fullName: result.data?.data?.fullName,
            avatar: result.data?.data?.avatar,
            coverImage: result.data?.data?.coverImage,
          };
          dispatch(authLogin(updateReduxData));
          dispatch(openSnackbar(`Profile Updated successfully. 😊`));
          navigate("/");
        }
      }
    } catch (error) {
      setBtnClicked(false);
      setOpenBackdropDialog(false);
      console.error(
        "error uploading avatar or user detail Image in profile: ",
        error
      );
      if (error.code === "ERR_NETWORK") {
        setCustomError(
          "Network error. Please check your internet connection or server is up ?"
        );
      } else {
        setCustomError(
          error.response?.data?.message || "An error occurred, no message"
        );
        dispatch(openSnackbar("Error Occured 🎈..."));
      }
    } finally {
      setBtnClicked(false);
      setOpenBackdropDialog(false);
    }
  };

  const handleClose = () => {
    dispatch(closeSnackbar());
  };

  const handleUploadCoverImage = async (e) => {
    try {
      const coverImage = e.target.files[0];

      // setDataCoverImage(coverImage);
      if (coverImage) {
        const imageUrl = URL.createObjectURL(coverImage); // Create URL for the file
        setCoverImage(imageUrl); // Set the URL as the cover image

        const res = await updateCoverImage(coverImage);
        if (res) {
          const sanitizedData = {
            id: res.data?.data?._id,
            userName: res.data?.data?.userName,
            email: res.data?.data?.email,
            fullName: res.data?.data?.fullName,
            avatar: res.data?.data?.avatar,
            coverImage: res.data?.data?.coverImage,
          };
          //console.log(sanitizedData);
          dispatch(authLogin(sanitizedData));
        }
      }
    } catch (error) {
      console.error("error uploading cover Image in profile: ", error);
      if (error.code === "ERR_NETWORK") {
        setCustomError(
          "Network error. Please check your internet connection or server is up ?"
        );
      } else {
        setCustomError(
          error.response?.data?.message || "An error occurred, no message"
        );
        dispatch(openSnackbar("Error Occured ...💀"));
      }
    }
  };

  const handleEditCoverImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-row">
      <SidePanel />
      {message && (
        <div className=" flex justify-center items-center py-2">
          <CustomSnackbar handleClose={handleClose} />
        </div>
      )}
      <div className="flex flex-col w-full ml-2 items-center">
        <div className="relative flex-grow  w-full">
          <div style={{ position: "relative", paddingBottom: "32%" }}>
            <BootstrapTooltips title="update Image">
              <CardMedia
                component="img"
                image={coverImage || "placeholder.jpg"}
                alt="Upload Cover Image"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                  cursor: "pointer", // add cursor to make it clickablbe
                }}
                onClick={handleEditCoverImage}
              />
            </BootstrapTooltips>

            <BootstrapTooltips title="update image">
              <IconButton
                style={{ position: "absolute", bottom: 8, right: 8 }}
                color="primary"
                onClick={handleEditCoverImage} // Call a function to handle editing cover image
              >
                <EditIcon />
              </IconButton>
            </BootstrapTooltips>

            <input
              type="file"
              accept="image/*"
              onChange={handleUploadCoverImage}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
          </div>
        </div>
        <div className="w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10 mt-6">
          <div className="mb-2 flex justify-center">
            <span className="inline-block w-full max-w-[100px]">
              <Logo width="70px" />
            </span>
          </div>
          <h2 className="text-center text-2xl font-bold leading-tight mb-8">
            Update Profile
          </h2>
          {customError && (
            <p className="text-red-600 mt-8 mb-2 text-center">{customError}</p>
          )}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-wrap"
            noValidate
          >
            <div className="space-y-3 w-full">
              <InputField
                label="user Name"
                placeholder="enter userName"
                type="userName"
                {...register("userName", {
                  pattern: {
                    value: /^[a-zA-Z0-9]+$/,
                    message: "Invalid userName formate, [a-z,0-9]",
                  },
                  required: {
                    value: true,
                    message: "userName required",
                  },
                })}
              />
              {errors.userName?.message && (
                <p className="text-red-600 text-left mt-0 mb-0">
                  {errors.userName.message}
                </p>
              )}
              <InputField
                label="E-mail:"
                placeholder="Enter your Email !"
                type="email"
                id="email"
                {...register("email", {
                  pattern: {
                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                    message: "Invalid Email formate",
                  },
                  required: {
                    value: true,
                    message: "email required",
                  },
                  validate: {
                    notAdmin: (fieldValue) => {
                      return (
                        fieldValue !== "admin@mytube.com" ||
                        "enter Different Email Address"
                      );
                    },
                  },
                })}
              />
              {errors.email?.message && (
                <p className="text-red-600 text-left">{errors.email.message}</p>
              )}
              <InputField
                label="full Name"
                placeholder="enter fullName"
                type="text"
                id="fullName"
                {...register("fullName", {
                  required: {
                    value: true,
                    message: "fullName required",
                  },
                })}
              />
              {errors.fullName?.message && (
                <p className="text-red-600 text-left mt-0 mb-0">
                  {errors.fullName.message}
                </p>
              )}
              <ImageUploadField
                label={initialData ? "Update Avatar" : "Upload Avatar"}
                type="file"
                initialAvatar={initialData?.avatar}
                name="existedAvatar"
                id="existedAvatar"
                {...register("existedAvatar", {
                  required: {
                    value: !initialData?.avatar,
                    message: "Avatar required",
                  },
                })}
                onChange={(file) => setupdatedAvatar(file)}
              />

              {errors.existedAvatar?.message && (
                <p className="text-red-600 text-left mt-0 mb-0">
                  {errors.existedAvatar.message}
                </p>
              )}
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
      <BackdropMUI
        open={openBackdropDialog}
        onClose={() => setOpenBackdropDialog(false)}
      />
    </div>
  );
};

export default ProfileComponent;
