import React, { useState } from "react";
import "./ImageUpload.css";
import Button from "@mui/material/Button";
import db from "./firebase";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { serverTimestamp } from "@firebase/firestore";

const ImageUpload = ({ username }) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleUpload = (e) => {
    e.preventDefault();
    const storage = getStorage();

    if (!image) return;
    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (sanpshot) => {
        // progress function
        const progress = Math.round(
          (sanpshot.bytesTransferred / sanpshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        // Error function
        console.log(error);
        alert(error.message);
      },
      () => {
        // complete function ...
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
          // post the image inside data base
          db.collection("posts").add({
            timestamp: serverTimestamp(),
            caption: caption,
            imageUrl: url,
            username: username,
          });
          setProgress(0);
          setCaption("");
          setImage(null);
        });
      }
    );
  };

  return (
    <div className="imageUpload">
      {/* Caption input */}
      {/* File Picker */}
      {/* Post button */}
      <progress className="imageUpload__progress" value={progress} max="100" />
      <input
        type="text"
        placeholder="Enter a caption..."
        onChange={(event) => setCaption(event.target.value)}
        value={caption}
      />
      <input type="file" onChange={handleChange} />
      <Button type="submit" onClick={handleUpload}>
        Post
      </Button>
    </div>
  );
};

export default ImageUpload;
