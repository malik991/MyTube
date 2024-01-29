import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";

import { useDispatch } from "react-redux";
import { InputField, Button, Logo } from "./index";
//import authServieObj from "../appwrite/auth";
import { loginUser } from "../apiAccess/auth";
import { useForm } from "react-hook-form"; // this is the main hook by which we will use forms
// import { DevTool } from "@hookform/devtools";

function LoginComponent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, control, formState } = useForm(); // control use for devTool
  const [error, setError] = useState("");
  const [btnClicked, setBtnClicked] = useState(false);
  const { errors: hookErrors } = formState; // hook field hookErrors

  const loginFun = async (data) => {
    console.log("function called", data);
    setError("");
    try {
      // chec btn clicked and change its appearence
      setBtnClicked(true);
      const res = await loginUser(data);
      if (res) {
        dispatch(authLogin(res.data));
        navigate("/MyVideos");
        //}
      }
    } catch (error) {
      console.log("error in login componenet: ", error);
      setError(error.response?.data?.message || "An error occurred");
    } finally {
      setBtnClicked(false);
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
        {/* here handleSubmit is key word and a function and an event comes 
        from hook-form and it get
         your function like login where form will be submitted , now do not need
         to manage state of your inputs hook-form manage it itself*/}

        <form className="mt-8" onSubmit={handleSubmit(loginFun)} noValidate>
          <div className="space-y-5">
            <InputField
              label="E-mail or Username:"
              placeholder="Enter your Email or Username!"
              type="emailOrUserName"
              {...register("emailOrUserName", {
                required: "Email or Username is required",
                validate: {
                  notEmailOrUsername: (fieldValue) => {
                    const isEmail =
                      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
                        fieldValue
                      );
                    const isUsername = /^[a-zA-Z0-9]+$/.test(fieldValue);
                    if (isEmail) {
                      return (
                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
                          fieldValue
                        ) || "Invalid Email format"
                      );
                    }
                    if (isUsername) {
                      // Add additional username validation logic if needed
                      return true;
                    }

                    // If it's not an email or username, show an error message
                    return "Invalid Email or Username format";
                  },
                  notAdmin: (fieldValue) => {
                    return (
                      fieldValue !== "admin@mytube.com" ||
                      "enter Different Email Address"
                    );
                  },
                },
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
                  message: "Password is mendatory",
                },
                // pattern: {
                //   value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{5,}$/,
                //   message:
                //     "min 5 chracters, 1 uppercase and 1 digit i.e Masdfgq12",
                // },
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
        {/* <DevTool control={control} /> */}
      </div>
    </div>
  );
}

export default LoginComponent;
