import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import { openSnackbar } from "../store/snackbarSlice";
import { useDispatch } from "react-redux";
import { Button, InputField, Logo } from "./index";
import { useForm } from "react-hook-form";
import { loginUser } from "../apiAccess/auth";
import BackdropMUI from "./MaterialUI/BackDrop";

function LoginComponent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState } = useForm({});
  const [error, setError] = useState("");
  const [btnClicked, setBtnClicked] = useState(false);
  const { errors: hookErrors } = formState;
  const [openBackdropDialog, setOpenBackdropDialog] = useState(false);

  const loginFun = async (data) => {
    setError("");
    try {
      setBtnClicked(true);
      setOpenBackdropDialog(true);
      const res = await loginUser(data);
      if (res) {
        const sanitizedData = {
          id: res.data?.data?.user?._id,
          userName: res.data?.data?.user?.userName,
          email: res.data?.data?.user?.email,
          fullName: res.data?.data?.user?.fullName,
          avatar: res.data?.data?.user?.avatar,
          coverImage: res.data?.data?.user?.coverImage,
        };
        dispatch(authLogin(sanitizedData));
        dispatch(
          openSnackbar(`Welcome, ${sanitizedData.userName} to My-Tube.😊`)
        );
        navigate("/dashboard");
      } else {
        alert("Login failed, please try again");
      }
    } catch (error) {
      console.log("error in login component: ", error);
      setError(error.response?.data?.message || "An error occurred");
      setOpenBackdropDialog(false);
    } finally {
      setBtnClicked(false);
      setOpenBackdropDialog(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="70px" />
          </span>
        </div>

        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Don&apos;t have any account?&nbsp;
          <Link
            to="/signup"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign Up
          </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <form className="mt-8" onSubmit={handleSubmit(loginFun)} noValidate>
          <div className="space-y-5">
            <InputField
              label="E-mail or Username:"
              placeholder="Enter your Email or Username!"
              type="emailOrUserName"
              {...register("emailOrUserName", {
                required: "Email or Username is required",
                // Add your validation rules here
              })}
            />
            {hookErrors.emailOrUserName?.message && (
              <p className="text-red-600 text-left mt-0 mb-0">
                {hookErrors.emailOrUserName.message}
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
                  message: "Password is mandatory",
                },
                // Add your validation rules here
              })}
            />
            {hookErrors.password?.message && (
              <p className="text-red-600 mt-0 text-left">
                {hookErrors.password.message}
              </p>
            )}
            <Button
              type="submit"
              className={`w-full ${
                btnClicked
                  ? "bg-gray-300 text-blue-700"
                  : "bg-blue-500 text-black"
              }`}
              disabled={btnClicked}
            >
              {btnClicked ? "Wait..." : "Sign in"}
            </Button>
          </div>
        </form>
      </div>
      <BackdropMUI
        open={openBackdropDialog}
        onClose={() => setOpenBackdropDialog(false)}
      />
    </div>
  );
}

export default LoginComponent;
