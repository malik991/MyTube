import React from "react";
import TextField from "@mui/material/TextField";

export default function CustomInputField({
  label,
  type,
  variant,
  required,
  error,
  errorMessage,
  ...props
}) {
  return (
    <TextField
      label={label}
      type={type}
      variant={variant}
      required={required}
      error={error}
      helperText={errorMessage}
      margin="dense"
      {...props}
    />
  );
}
