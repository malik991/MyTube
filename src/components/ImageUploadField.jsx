import React, { useRef, useState, useEffect } from "react";
import { Avatar, Button } from "@mui/material";
import { ProfilePictureContainer } from "./style.js";

const ImageUploadField = React.forwardRef(function Input(
  { label, type, onChange, name, initialAvatar, ...props },
  ref
) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(initialAvatar);

  const handleUploadedFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const urlImage = URL.createObjectURL(file);
      setPreview(urlImage);
      onChange(file);
    }
  };

  const onUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    // Update the preview if the initialAvatar changes
    setPreview(initialAvatar);
  }, [initialAvatar]);

  return (
    <div className="w-full text-left">
      {label && (
        <label
          className="inline-block mb-1 pl-1 font-serif text-xl"
          htmlFor={props.id || id}
        >
          {label}
        </label>
      )}
      <ProfilePictureContainer>
        <input
          type={type}
          ref={(e) => {
            if (ref) {
              if (typeof ref === "function") {
                ref(e);
              } else {
                ref.current = e;
              }
            }
            fileInputRef.current = e;
          }}
          style={{ display: "none" }}
          onChange={(event) => handleUploadedFile(event)}
          name={name}
          {...props}
        />
        <Avatar src={preview} sx={{ width: 80, height: 80 }} />
        <Button variant="text" onClick={onUpload}>
          {preview ? "Change Avatar" : "Upload Avatar"}
        </Button>
      </ProfilePictureContainer>
    </div>
  );
});

export default ImageUploadField;
