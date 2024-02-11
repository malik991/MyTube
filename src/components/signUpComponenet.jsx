import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { registerUser } from "../apiAccess/auth";
import { InputField, Button, Logo, ImageUploadField } from "./index";
//import { DevTool } from "@hookform/devtools";

function SignUpComponenet() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, control, formState } = useForm({}); //shouldUnregister: true,
  const [error, setError] = useState();
  const [btnClicked, setBtnClicked] = useState(false);
  const { errors: hookErrors } = formState; // hook field hookErrors
  const [avatar, setAvatar] = useState(null);

  async function signUp(data) {
    if (avatar) {
      data.avatar = avatar;
    } else {
      alert("avater not uloaded");
    }
    // console.log("avatar", data?.avatar, "coverImage: ", data.coverImage[0]);

    setError("");
    try {
      setBtnClicked(true);
      const res = await registerUser(data);
      //console.log("res, : ", res);
      if (res) {
        // const sanitizedData = {
        //   // Extract only the necessary properties from res.data

        //   id: res.data?.data?.user?._id,
        //   userName: res.data?.data?.user?.userName,
        //   email: res.data?.data?.user?.email,
        //   fullName: res.data?.data?.user?.fullName,
        //   avatar: res.data?.data?.user?.avatar,
        //   coverImage: res.data?.data?.user?.coverImage,
        //   // Add more properties as needed
        // };
        //dispatch(authLogin(sanitizedData));
        navigate("/login");
      } else {
        alert("signup failed, please try again");
      }
    } catch (error) {
      console.log("error in signup component: ", error);
      //setError(error.response?.data?.message || "An error occurred");
      if (error.code === "ERR_NETWORK") {
        setError(
          "Network error. Please check your internet connection or server is up ?"
        );
      } else {
        // Check if response.data contains a meaningful error message
        const serverErrorMessage = error.response?.data?.match(
          /<pre>([\s\S]*?)<\/pre>/
        )?.[1];
        if (serverErrorMessage) {
          const splitContent = serverErrorMessage?.split("<br>");
          setError(splitContent ? splitContent[0].trim() : "An error occurred");
        } else {
          setError(
            error.response?.data?.message || "An error occurred, no message"
          );
        }
      }
    } finally {
      // Reset btnClicked to false after the asynchronous process is complete
      setBtnClicked(false);
    }
  }

  //
  return (
    <div className="flex items-center justify-center">
      <div
        className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}
      >
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="70px" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign up to create account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign In
          </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

        <form className="mt-8" onSubmit={handleSubmit(signUp)} noValidate>
          <div className="space-y-3">
            <InputField
              label="userName"
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
            {hookErrors.userName?.message && (
              <p className="text-red-600 text-left mt-0 mb-0">
                {hookErrors.userName.message}
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
            {hookErrors.email?.message && (
              <p className="text-red-600 text-left">
                {hookErrors.email.message}
              </p>
            )}
            <InputField
              label="Password"
              type="password"
              placeholder="Enter your password"
              id="password"
              {...register("password", {
                required: {
                  value: true,
                  message: "Password is mendatory",
                },
                pattern: {
                  value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/,
                  message:
                    "min 6 chracters, 1 uppercase and 1 digit i.e Masd3a",
                },
              })}
            />
            {hookErrors.password?.message && (
              <p className="text-red-600 mt-0 text-left">
                {hookErrors.password.message}
              </p>
            )}
            <InputField
              label="fullName"
              placeholder="enter fullName"
              type="text"
              id="fullName"
              {...register("fullName", {
                // pattern: {
                //   value: /^[a-zA-Z0-9]+$/,
                //   message: "Invalid userName formate, [a-z,0-9]",
                // },
                required: {
                  value: true,
                  message: "fullName required",
                },
              })}
            />
            {hookErrors.fullName?.message && (
              <p className="text-red-600 text-left mt-0 mb-0">
                {hookErrors.fullName.message}
              </p>
            )}

            <ImageUploadField
              label="Profile Picture"
              type="file"
              name="profilePicture"
              id="profilePicture"
              {...register("profilePicture", {
                required: {
                  value: true,
                  message: "Avatar required",
                },
              })}
              onChange={(file) => setAvatar(file)}
            />
            {hookErrors.profilePicture?.message && (
              <p className="text-red-600 text-left mt-0 mb-0">
                {hookErrors.profilePicture.message}
              </p>
            )}
            <InputField
              label="cover Image"
              type="file"
              id="coverImage"
              {...register("coverImage")}
            />

            <Button
              type="submit"
              className={`w-full ${
                btnClicked
                  ? "bg-gray-300 text-blue-700"
                  : "bg-blue-500 text-black"
              }`}
              disabled={btnClicked}
            >
              {btnClicked ? "Wait..." : "Create Account"}
            </Button>
          </div>
        </form>
        {/* <DevTool control={control} /> */}
      </div>
    </div>
  );
}

export default SignUpComponenet;
