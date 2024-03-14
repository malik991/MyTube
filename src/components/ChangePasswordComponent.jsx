import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../apiAccess/auth";
import { useSelector } from "react-redux";
import { Button, InputField, Logo } from "./index";
import { useForm } from "react-hook-form";
import BackdropMUI from "./MaterialUI/BackDrop";
import { openSnackbar } from "../store/snackbarSlice";
import { useDispatch } from "react-redux";

const ChangePasswordComponent = () => {
  const [btnSubmit, setBtnSubmit] = useState(false);
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const { register, handleSubmit, formState, watch } = useForm({}); // control use for devTool
  const [customeError, setCustomeError] = useState("");
  const { errors: hookErrors } = formState;
  const newPassword = watch("newPassword", "");
  const dispatch = useDispatch();
  const [openBackdropDialog, setOpenBackdropDialog] = useState(false);

  const validateReEnterPassword = (value) => {
    if (value === newPassword) {
      return true; // Passwords match
    }
    return "re-enter Passwords do not match";
  };

  const validateOldPassword = (value) => {
    if (value !== newPassword) {
      return true; // Old password and new password are not the same
    }
    return "Old password and new password cannot be the same";
  };

  const onSubmit = async (data) => {
    //console.log("on submit clicked", data);
    try {
      setOpenBackdropDialog(true);
      setCustomeError("");
      setBtnSubmit(true);
      if (authStatus && data) {
        const res = await changePassword(data);
        if (res?.data?.success) {
          dispatch(openSnackbar(`Password updated successfully. 😊`));
          navigate("/dashboard/my-videos");
        }
      } else {
        setCustomeError("something wrong while update password");
      }
    } catch (error) {
      setOpenBackdropDialog(false);
      console.log("error in password change", error);
      if (error.code === "ERR_NETWORK") {
        setCustomeError(
          "Network error. Please check your internet connection or server is up ?"
        );
      } else {
        // Check if response.data contains a meaningful error message
        const serverErrorMessage = error.response?.data?.match(
          /<pre>([\s\S]*?)<\/pre>/
        )?.[1];
        if (serverErrorMessage) {
          const splitContent = serverErrorMessage?.split("<br>");
          setCustomeError(
            splitContent ? splitContent[0].trim() : "An error occurred"
          );
        } else {
          setCustomeError(
            error.response?.data?.message || "An error occurred, no message"
          );
        }
      }
    } finally {
      setOpenBackdropDialog(false);
      setBtnSubmit(false);
    }
  };

  // chack authstatus
  // get old password and new password with regex formate
  // match re enter password and new password at fron level
  // on submit hit db, if response is ok than forcefully call logout and move to login page.

  return authStatus ? (
    <div className="flex items-center justify-center w-full">
      <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="70px" />
          </span>
        </div>

        <h2 className="text-center text-2xl font-bold leading-tight">
          Change Your Password
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          password should be minimum 6 charchter with 1 capital letter and 1
          number;
        </p>
        {customeError && (
          <p className="text-red-600 mt-8 text-center">{customeError}</p>
        )}

        <form className="mt-8" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-5">
            <InputField
              label="Old Password"
              type="password"
              placeholder="Enter your old-password"
              name="oldPassword"
              id="oldPassword"
              {...register("oldPassword", {
                required: {
                  value: true,
                  message: "old Password is mendatory",
                },
                validate: validateOldPassword,
              })}
            />
            {hookErrors.oldPassword?.message && (
              <p className="text-red-600 text-left mt-0 mb-0">
                {hookErrors.oldPassword.message}
              </p>
            )}
            <InputField
              label="New Password"
              type="password"
              placeholder="Enter your New-password"
              name="newPassword"
              id="newPassword"
              {...register("newPassword", {
                required: {
                  value: true,
                  message: "New Password is mendatory",
                },
                pattern: {
                  value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/,
                  message:
                    "min 6 chracters, 1 uppercase and 1 digit i.e Masd3a",
                },
              })}
            />
            {hookErrors.newPassword?.message && (
              <p className="text-red-600 mt-0 text-left">
                {hookErrors.newPassword.message}
              </p>
            )}
            <InputField
              label="Re-enter New Password"
              type="password"
              placeholder="Re-enter your New password"
              name="reEnterNewPassword"
              id="reEnterNewPassword"
              {...register("reEnterNewPassword", {
                required: "Re-enter New Password is mandatory",
                validate: validateReEnterPassword,
              })}
            />
            {hookErrors.reEnterNewPassword && (
              <p className="text-red-600">
                {hookErrors.reEnterNewPassword.message}
              </p>
            )}
            <Button
              type="submit"
              className={`w-full ${
                btnSubmit
                  ? "bg-gray-300 text-blue-700"
                  : "bg-blue-500 text-black"
              }`}
              disabled={btnSubmit}
            >
              {btnSubmit ? "Wait..." : "Update"}
            </Button>
          </div>
        </form>
        {/* <DevTool control={control} /> */}
      </div>
      <BackdropMUI
        open={openBackdropDialog}
        onClose={() => setOpenBackdropDialog(false)}
      />
    </div>
  ) : (
    <p>please login first</p>
  );
};

export default ChangePasswordComponent;
