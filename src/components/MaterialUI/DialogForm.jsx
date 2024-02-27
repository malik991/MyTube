import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CustomInputField from "./CustomInputField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
//import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../../config/axiosInstance";
import CircularDeterminate from "./CircularProgress";

export default function DialogForm({ open, handleClose, onSuccess }) {
  const [isPublished, setIsPublished] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false); // New state to track if an error occurred
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSwitchChange = (event) => {
    setIsPublished(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setProgress(0);
    setApiError("");
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    //formJson.isPublished = isPublished;
    //console.log("formJson: ", formJson);
    formData.set("isPublished", isPublished ? "true" : "false");
    // formData.forEach((value, key) => {
    //   console.log(`${key}: ${value}`);
    // });

    // Simulate progress increment in intervals
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 100 : prevProgress + 10
      );
    }, 800);
    try {
      if (!formJson.name) {
        setApiError("play list name is mandatory");
        return;
      }
      const res = await axiosInstance.post(
        `/playlist/create-play-list`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      clearInterval(timer); // Clear the interval

      if (res) {
        console.log(typeof onSuccess, onSuccess);
        onSuccess(); // Call the success handler provided by the parent
        handleClose();
      }
      return res.data?.data;
    } catch (error) {
      console.log("error in dialog form: ", error);
      setApiError(error.response?.data?.message || "error not recieved");
      setErrorOccurred(true);
    } finally {
      setIsPublished(false);
      setLoading(false);
      setProgress(0);
    }
  };

  // Close the dialog only when there's no error or when the dialog is closed by the user
  useEffect(() => {
    if (open && errorOccurred && !loading) {
      setLoading(false); // Reset loading state if there's an error
      setErrorOccurred(false); // Reset errorOccurred state
    }
  }, [open, errorOccurred, loading]);

  const cusHandleClose = () => {
    setApiError("");
    setIsPublished(false);
    handleClose();
  };
  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Create PlayList</DialogTitle>
          <DialogContent
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {loading > 0 ? (
              <Box display="flex" justifyContent="center">
                <CircularDeterminate variant="determinate" value={progress} />
                {/* <CircularProgress /> */}
              </Box>
            ) : (
              <>
                <DialogContentText>
                  This is your personal playlist where you can add videos and if
                  you want you can publish your PlayList also.
                </DialogContentText>
                {apiError && (
                  <p style={{ color: "red", textAlign: "center" }}>
                    {apiError}
                  </p>
                )}
                <Box
                  sx={{
                    border: "2px solid black",
                    padding: 2,
                    borderRadius: 2,
                    display: "inline-block",
                    margin: "auto",
                    textAlign: "center",
                  }}
                >
                  <Box sx={{ display: "block", my: 2 }}>
                    <CustomInputField
                      label="Title"
                      id="name"
                      name="name"
                      type="text"
                      variant="outlined"
                      margin="dense"
                      error={true}
                      errorMessage={"Title mandatory"}
                      required={true}
                    />
                  </Box>
                  <Box sx={{ display: "block", my: 2 }}>
                    <CustomInputField
                      label="Description"
                      type="text"
                      id="description"
                      name="description"
                      variant="outlined"
                      margin="dense"
                      multiline
                      rows={4}
                    />
                  </Box>
                  <Box sx={{ display: "block" }}>
                    <CustomInputField
                      label="Cover Image"
                      type="file"
                      id="coverImage"
                      name="coverImage"
                      variant="outlined"
                      margin="dense"
                      error={false}
                      errorMessage=""
                      accept="image/*"
                    />
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isPublished}
                        onChange={handleSwitchChange}
                        id="name"
                        name="isPublished"
                      />
                    }
                    label="isPublished"
                  />
                </Box>
              </>
            )}
          </DialogContent>
          {!loading && (
            <DialogActions>
              <Button onClick={cusHandleClose}>Cancel</Button>
              <Button type="submit">Submit</Button>
            </DialogActions>
          )}
        </form>
      </Dialog>
    </React.Fragment>
  );
}
