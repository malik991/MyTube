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

export default function DialogForm({
  open,
  handleClose,
  onSuccess,
  initialData,
}) {
  //console.log("init: ", initialData);
  const initialFormData = {
    name: "",
    description: "",
    coverImage: null,
    isPublished: false,
  };
  const [formData, setFormData] = useState({ ...initialFormData });

  const [errorOccurred, setErrorOccurred] = useState(false);
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSwitchChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      isPublished: event.target.checked,
    }));
  };

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value, // For file inputs, store the file itself
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setProgress(0);
    setApiError("");

    // const formData = new FormData(event.currentTarget);
    // const formJson = Object.fromEntries(formData.entries());
    // //formJson.isPublished = isPublished;
    // //console.log("formJson: ", formJson);
    // formData.set("isPublished", isPublished ? "true" : "false");

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    formDataToSend.set("isPublished", formData.isPublished ? "true" : "false");

    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 100 : prevProgress + 10
      );
    }, 800);

    try {
      if (!formData.name) {
        setApiError("Playlist name is mandatory");
        return;
      }

      let response;
      if (initialData) {
        response = await axiosInstance.post(
          `/playlist/update-playlist/${initialData._id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await axiosInstance.post(
          `/playlist/create-play-list`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      clearInterval(timer);
      if (response) {
        onSuccess();
        handleClose();
        setFormData({ ...initialFormData });
      }
      return response.data?.data;
    } catch (error) {
      console.log("error in dialog form: ", error);
      setApiError(error.response?.data?.message || "Error not received");
      setErrorOccurred(true);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  useEffect(() => {
    if (open && errorOccurred && !loading) {
      setLoading(false);
      setErrorOccurred(false);
    }

    if (initialData) {
      setFormData({ ...initialData });
    } else {
      setFormData({ ...initialFormData });
    }
  }, [open, errorOccurred, loading, initialData]);

  const cusHandleClose = () => {
    setApiError("");
    handleClose();
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {initialData ? "Update Playlist" : "Create Playlist"}
          </DialogTitle>
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
              </Box>
            ) : (
              <>
                <DialogContentText>
                  This is your personal playlist where you can add videos and if
                  you want you can publish your Playlist also.
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
                      value={formData.name}
                      onChange={handleChange}
                      required
                      error={!formData.name}
                      errorMessage={"Title mandatory"}
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
                      value={formData.description}
                      onChange={handleChange}
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
                      onChange={handleChange}
                      accept="image/*"
                    />
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isPublished}
                        onChange={handleSwitchChange}
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
              <Button type="submit">{initialData ? "Update" : "Submit"}</Button>
            </DialogActions>
          )}
        </form>
      </Dialog>
    </React.Fragment>
  );
}
