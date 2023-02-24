import React, { useEffect } from "react";
import "./postoptions.scss";
import { useState } from "react";
import Backdrop from "../Backdrop/Backdrop";
import { deletePost } from "../../firebase";
import { useNavigate } from "react-router-dom";

const PostOptions = (props) => {
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (showOptions) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showOptions]);
  const handleDeletePost = () => {
    deletePost(props.post.id).then(() => {
      setShowOptions(false);
      navigate("/");
      window.location.reload();
    });
  };

  return (
    <div className="post-options flex ">
      <button
        className="flex fd-c ai-c jc-c"
        onClick={() => {
          setShowOptions(!showOptions);
        }}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {showOptions && (
        <>
          <div className="post-options-menu flex fd-c ai-c jc-c">
            <button
              className="post-options-menu-item"
              onClick={() => {
                handleDeletePost();
              }}
            >
              Delete Post
            </button>
          </div>
          <Backdrop onCancel={() => setShowOptions(false)} />
        </>
      )}
    </div>
  );
};

export default PostOptions;
