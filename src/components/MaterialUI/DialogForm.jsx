import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CustomInputField from "./CustomInputField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { createPlayLists } from "../../store/playListSlice";
import { useSelector, useDispatch } from "react-redux";

export default function FormDialog({ open, handleClose, onSuccess }) {
  const [isPublished, setIsPublished] = useState(false);
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.playlist);
  const [loading, setLoading] = useState(false);

  const handleSwitchChange = (event) => {
    setIsPublished(event.target.checked);
  };
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: async (event) => {
            event.preventDefault();
            setLoading(true);
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            formJson.isPublished = isPublished;
            // const title = formJson.title;
            console.log(formJson);
            dispatch(createPlayLists(formJson))
              .then(() => {
                setIsPublished(false);
                onSuccess(); // Call the success handler provided by the parent
                setLoading(false);
                handleClose();
              })
              .catch((error) => {
                console.log("Error in creating playlist:", error);
              });
          },
        }}
      >
        <DialogTitle>Create PlayList</DialogTitle>
        <DialogContent
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {loading ? ( // Show CircularProgress if loading
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : (
            <>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <DialogContentText>
                this is your personal playlist where you can add videos and if
                you want you can publish your PlayList also.
              </DialogContentText>
              <Box
                sx={{
                  border: "2px solid black",
                  padding: 2,
                  borderRadius: 2,
                  display: "inline-block", // Adjust the width as needed
                  margin: 2,
                  margin: "auto", // Center the box horizontally
                  textAlign: "center", // Center the text content within the box
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
                    errorMessage={"Title mendatory"}
                    required={true}
                  />
                </Box>
                <Box sx={{ display: "block", my: 2 }}>
                  <CustomInputField
                    label="Description"
                    type="text"
                    id="name"
                    name="description"
                    variant="outlined"
                    margin="dense"
                    multiline
                    rows={4}
                    //value={description}
                  />
                </Box>
                <Box sx={{ display: "block" }}>
                  <CustomInputField
                    label="Cover Image"
                    type="file"
                    id="name"
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
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </DialogActions>
        )}
      </Dialog>
    </React.Fragment>
  );
}
