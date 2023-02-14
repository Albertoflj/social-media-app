import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import emptyHeart from "../../assets/icons/heart.svg";
import fullHeart from "../../assets/icons/heart-fill.svg";
import commentIcon from "../../assets/icons/chat.svg";
import sendIcon from "../../assets/icons/send.svg";

import { useParams } from "react-router-dom";
import { getPost, sendLike } from "../../firebase";
import CommentSection from "../CommentSection/CommentSection";
import Footer from "../Footer/Footer";
import { render } from "enzyme";
import { useSelector } from "react-redux";
import Header from "../Header/Header";
const Post = (props) => {
  let feed = props.for;
  //TODO MAKE THIS A COMPONENT THAT SHOW DIFFERENTLY ON FEED AND POST PAGE
  //declaring

  const [post, setPost] = useState(props.post);
  const [loading, setLoading] = useState(true);
  const { postid } = useParams();
  const [showComments, setShowComments] = useState("comments-hidden");
  const user = useSelector((state) => state.user.user);
  const [isLiked, setIsLiked] = useState(false);

  const comments = (object, forCount) => {
    let count = object.commentsLength;
    let phrase = "";
    if (count > 1) {
      phrase = `View all ${count} comments`;
    } else if (count === 1) {
      phrase = `View comment`;
    }
    if (forCount) {
      return count;
    } else {
      return phrase;
    }
  };

  const handleLike = () => {
    if (!postid) {
      sendLike(user, post.id).then(() => {
        setIsLiked(!isLiked);
      });
    } else {
      sendLike(user, postid).then(() => {
        setIsLiked(!isLiked);
      });
    }
  };

  // const [post, setPost] = useState(props.post);
  useEffect(() => {
    if (postid) {
      getPost(postid, null, (currentPost) => {
        setIsLiked(currentPost.likedBy.includes(user));
        setPost(currentPost);
        setLoading(false);
      });
    } else {
      setIsLiked(props.post.likedBy.includes(user));
      setLoading(false);
    }
  }, [user]);
  const handleShowComments = () => {
    setShowComments("comments-visible");
    document.body.style.overflowY = "hidden";
    console.log(showComments);
  };

  return (
    <>
      {loading ? (
        <>Loading...</>
      ) : (
        <>
          {postid ? <Header /> : null}
          <div className="post-parent flex jc-c">
            <div key={post.id} className="post padding">
              {/* photo */}
              <Link to={`/user/${post.creator.username}`}>
                <div className="user-details flex fd-r">
                  <img src={post.creator.photoURL} alt="profile photo" />
                  <div className="name-username">
                    <h5 className="display-name">{post.creator.displayName}</h5>
                    <h5 className="username">@{post.creator.username}</h5>
                  </div>
                </div>
              </Link>
              <img src={post.photo} alt="photo" className="post-photo" />
              <div className="interact-buttons flex ai-c">
                <button
                  className="like-button flex ai-c jc-c"
                  onClick={() => {
                    handleLike();
                  }}
                >
                  <img
                    src={isLiked ? fullHeart : emptyHeart}
                    alt="heart"
                    className="icon"
                  />
                </button>
                <button className="comment-button flex ai-c">
                  <img src={commentIcon} alt="comment" className="icon" />
                </button>
                <button className="share-button flex ai-c">
                  <img src={sendIcon} alt="share" className="icon" />
                </button>
              </div>
              <div className="caption-content flex fd-r">
                <Link to={`/user/${post.creator.username}`}>
                  <p className="caption-author">{post.creator.username}</p>
                </Link>
                <p className="caption-text">{post.caption}</p>
              </div>

              <Link to={`/post/${post.id}`} className="desktop flex jc-fs">
                <p
                  className="view-comments"
                  onClick={() => {
                    handleShowComments();
                  }}
                >
                  {comments(post, false)}
                </p>
              </Link>
              <button
                className="mobile view-comments"
                onClick={() => {
                  handleShowComments();
                }}
              >
                {comments(post, false)}
              </button>
              {comments(post, true) < 2 ? null : (
                <div className="comment flex fd-r ai-c">
                  <Link replace to={`/user/${post.comments[0].author_name}`}>
                    <p className="caption-author">
                      {post.comments[0].author_name}
                    </p>
                  </Link>
                  <p
                    className="caption-text"
                    onClick={() => {
                      handleShowComments();
                    }}
                  >
                    {post.comments[0].text}
                  </p>
                </div>
              )}
              <Link to={`/post/${post.id}`} className="desktop flex jc-fs">
                <p
                  className="view-comments"
                  onClick={() => {
                    handleShowComments();
                  }}
                >
                  Add comment...
                </p>
              </Link>
              <button
                className="mobile view-comments"
                onClick={() => {
                  handleShowComments();
                }}
              >
                Add comment...
              </button>

              {showComments === "comments-visible" ? (
                <CommentSection
                  comments={post.comments}
                  post={post}
                  className={showComments}
                  onBack={() => {
                    setShowComments("comments-hidden");
                  }}
                />
              ) : null}
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default Post;
