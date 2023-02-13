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

const CommentSection = (props) => {
  const [comments, setComments] = useState(props.comments);
  const [commentsPos, setCommentsPos] = useState(props.show);
  const [errorClass, setErrorClass] = useState("");
  const [errorPlaceholder, setErrorPlaceholder] = useState("Add a comment...");
  const [loading, setLoading] = useState(true);
  const commentRef = useRef();

  //  const postCommentsCollectionRef = collection(db, "posts", postId, "comments");
  const postCommentsCollectionRef = collection(
    db,
    "posts",
    props.post.id,
    "comments"
  );
  const commentsQuery = query(
    postCommentsCollectionRef,
    orderBy("createdAt"),
    limit(25)
  );
  const [commentss] = useCollectionData(commentsQuery);

  // const [user] = useAuthState();
  const user = useSelector((state) => state.user);
  const userPhoto = useSelector((state) => state.user.photoURL);
  const username = useSelector((state) => state.user.username);
  function onbacc() {
    // move oos
    setCommentsPos("left-oo-screen");
  }
  function submitComment(e) {
    e.preventDefault();
    let comment = commentRef.current.value;
    if (comment.length > 100) {
      setErrorClass("comment-too-long");
      setErrorPlaceholder("Comment too long");
      commentRef.current.value = "";
      return;
    } else if (comment.length <= 0) {
      setErrorClass("comment-too-long");
      setErrorPlaceholder("Comment too short");
      commentRef.current.value = "";
    } else {
      sendComment(props.post.id, comment, user.user, user.username, userPhoto);
    }
  }
  useEffect(() => {
    //NEED TO GET USER DATA AND PUT IT IN EACH COMMENT;
    //put comments in array
    // Object.values(comments).map((comment) => {
    //   getUserData(comment.author).then((data) => {
    //     console.log(data);
    //   });
    // });
    // getUserData
    //GET COMMENTS FUNCTION HERE
    // getComments(props.post.id);
    if (commentss) {
      setLoading(false);
    }
  }, [commentss]);
  return (
    <div className={`comment-section mobile ${commentsPos}`}>
      {loading ? (
        <>Loading...</>
      ) : (
        <>
          <TitleTab title="Comments" onBack={onbacc} />
          <div className="comment-section-content padding">
            <div className="comments flex fd-c padding">
              {commentss.map((comment, index) => (
                <>
                  <div key={index} className="comment flex fd-r ai-c ">
                    <img
                      src={comment.author_photo}
                      className="comment-photo"
                    ></img>
                    <div className="comment-content flex fd-c">
                      <Link to={`/user/${comment.author_name}`}>
                        <h4 className="comment-username">
                          {comment.author_name}
                        </h4>
                      </Link>
                      <p className="comment-text">{comment.text}</p>
                    </div>
                  </div>
                </>
              ))}
            </div>

            <form className="flex fd-r jc-c ai-c" onSubmit={submitComment}>
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
          </div>
          {/* <Footer /> */}
        </>
      )}
    </div>
  );
};

export default CommentSection;
