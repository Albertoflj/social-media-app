import { useState } from "react";
import {
  checkIfUserIsSignedIn,
  sendComment,
  signInWithGoogle,
} from "../../firebase";
import "./commentsection.scss";
import sendIcon from "../../assets/icons/send.svg";
import { useRef } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

const CommentInput = (props) => {
  const [errorClass, setErrorClass] = useState("");
  const [errorPlaceholder, setErrorPlaceholder] = useState("Add a comment...");
  const commentRef = useRef();
  const user = useSelector((state) => state.user);
  const userPhoto = useSelector((state) => state.user.photoURL);

  async function submitComment(e) {
    e.preventDefault();
    let comment = commentRef.current.value;
    if (checkIfUserIsSignedIn()) {
      if (comment.length > 100) {
        setErrorClass("error");
        setErrorPlaceholder("Comment too long");
        commentRef.current.value = "";
        return;
      } else if (comment.length <= 0) {
        setErrorClass("error");
        setErrorPlaceholder("Comment too short");
        commentRef.current.value = "";
      } else {
        await sendComment(
          props.post.id,
          comment,
          user.user,
          user.username,
          userPhoto
        );

        commentRef.current.value = "";
      }
    } else {
      signInWithGoogle();
    }
  }

  return (
    <form
      className="flex fd-r jc-c ai-c padding comment-submit"
      onSubmit={submitComment}
    >
      <input
        ref={commentRef}
        type="text"
        placeholder={errorPlaceholder}
        className={`comment-input ${errorClass}`}
      ></input>
      <button>
        <img src={sendIcon} alt="" />
      </button>
    </form>
  );
};

export default CommentInput;
