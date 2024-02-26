import React from "react";
import { useSelector } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";

const CustomSnackbar = ({ handleClose }) => {
  const { open, message } = useSelector((state) => state.snackbar);

  const [anchorOrigin, setAnchorOrigin] = React.useState({
    vertical: "top",
    horizontal: "center",
  });

  return (
    open && (
      <Snackbar
        open={open}
        autoHideDuration={2500}
        onClose={handleClose}
        message={message}
        TransitionComponent={Slide}
        anchorOrigin={anchorOrigin}
      />
    )
  );
};

export default CustomSnackbar;
