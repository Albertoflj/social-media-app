import React from "react";
import "./createpost.scss";
import cardImage from "../../assets/icons/card-image.svg";
import { useState } from "react";
import { auth, createPost, storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { uuidv4 } from "@firebase/util";
import { useSelector } from "react-redux";
import { useAuthState } from "react-firebase-hooks/auth";

const CreatePost = (props) => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [errorClass, setErrorClass] = useState("");
  const [imageText, setImageText] = useState("Drop image here");
  const [user] = useAuthState(auth);

  const validateImage = (img) => {
    const validTypes = ["image/png", "image/jpeg", "image/gif"];
    if (validTypes.indexOf(img.type) === -1) {
      setImageText("Please select a valid image");
      setErrorClass("error");
      return false;
    }
    return true;
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!image) {
      setImageText("Please select an image");
      setErrorClass("error");
      return;
    }
    if (!validateImage(image)) return;
    const imageRef = ref(storage, `images/${image.name + uuidv4()}`);
    uploadBytes(imageRef, image).then((snapshot) => {
      getDownloadURL(imageRef).then((url) => {
        let post = {
          caption: caption,
          user: user.uid,
          image: url,
          likedBy: [],
        };
        createPost(post);
        props.onSuccess();
        window.location.reload();
      });
    });
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImageText("Image added");
    setErrorClass("success");
    const dt = e.dataTransfer;
    const files = dt.files;
    setImage(files[0]);
  };

  return (
    <div className="create-post padding">
      <div className="create-post-content">
        <div className="create-post-header flex ai-c jc-c">
          <h1>Create Post</h1>
        </div>
        <div className={`create-post-photo-and-caption flex jc-c ai-c fd-c `}>
          <form
            className="flex fd-c ai-c"
            onSubmit={(event) => {
              handleUpload(event);
            }}
          >
            <div className={`drop-file-here flex jc-c ai-c fd-c ${errorClass}`}>
              <p>{imageText}</p>
              <img src={cardImage} alt="card-image" className="card-image" />
              <input
                type="file"
                onChange={(event) => {
                  setImage(event.target.files[0]);
                  console.log("image: ", image);
                  setImageText("Image added");
                  setErrorClass("success");
                }}
                accept="image/png, image/gif, image/jpeg"
                onDragOver={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                onDrop={handleDrop}
              />
            </div>
            <div className="create-post-photo"></div>
            <div className="create-post-caption flex fd-c jc-c ai-c">
              {/* <label htmlFor="caption">Caption</label> */}
              <input
                type="text"
                placeholder="Write a caption..."
                name="caption"
                className={`caption `}
                onChange={(event) => {
                  setCaption(event.target.value);
                  console.log("caption: ", caption);
                }}
              />
            </div>
            <button className="post-button" type="submit">
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
