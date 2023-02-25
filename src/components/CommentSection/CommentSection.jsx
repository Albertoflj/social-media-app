import { useEffect, useState } from "react";
import { db, getComments, getUserData, sendComment } from "../../firebase";
import Footer from "../Footer/Footer";
import TitleTab from "../TitleTab/TitleTab";
import "./commentsection.scss";
import sendIcon from "../../assets/icons/send.svg";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSelector } from "react-redux";
import { collection, limit, orderBy, query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import CommentInput from "./CommentInput";
import Comments from "./Comments";

const CommentSection = (props) => {
  const [commentsPos, setCommentsPos] = useState("comments-visible");

  const commentRef = useRef();
  useEffect(() => {
    return () => {
      document.body.classList.remove("no-scroll");
      document.body.style.overflowY = "scroll";
    };
  }, []);
  function onbacc() {
    //make timeout
    setCommentsPos("comments-hidden");
    document.body.classList.remove("no-scroll");
    document.body.style.overflowY = "scroll";

    setTimeout(() => {
      props.onBack();
      setCommentsPos("comments-visible");
    }, 1000);
  }

  return (
    <div className={`comment-section mobile ${commentsPos} `}>
      <>
        <TitleTab title="Comments" onBack={onbacc} />
        <Comments post={props.post} />
        <CommentInput commentRef={commentRef} post={props.post} />
        {/* <Footer /> */}
      </>
    </div>
  );
};

export default CommentSection;
