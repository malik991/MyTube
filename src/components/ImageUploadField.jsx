import React, { useRef, useState } from "react";
import { Avatar, Button } from "@mui/material";
import { HiddenInput, ProfilePictureContainer, Label } from "./style.js";

const ImageUploadField = ({ register }) => {
  const hiddenInputRef = useRef();

  const { ref: registerRef, ...rest } = register("profilePicture");

  const [preview, setPreview] = useState();

  const handleUploadedFile = (event) => {
    const file = event.target.files[0];

    const urlImage = URL.createObjectURL(file);

    setPreview(urlImage);
  };

  const onUpload = () => {
    hiddenInputRef.current.click();
  };

  const uploadButtonLabel = preview ? "Change image" : "Upload image";

  return (
    <ProfilePictureContainer>
      <Label>Profile picture</Label>

      <HiddenInput
        type="file"
        name="profilePicture"
        {...rest}
        onChange={handleUploadedFile}
        ref={(e) => {
          registerRef(e);
          hiddenInputRef.current = e;
        }}
      />

      <Avatar src={preview} sx={{ width: 80, height: 80 }} />

      <Button variant="text" onClick={onUpload}>
        {uploadButtonLabel}
      </Button>
    </ProfilePictureContainer>
  );
};

export default ImageUploadField;
