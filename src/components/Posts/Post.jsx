import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import emptyHeart from "../../assets/icons/heart.svg";
import fullHeart from "../../assets/icons/heart-fill.svg";
import commentIcon from "../../assets/icons/chat.svg";
import sendIcon from "../../assets/icons/send.svg";

import { useParams } from "react-router-dom";
import {
  checkIfUserIsSignedIn,
  getPost,
  sendLike,
  signInWithGoogle,
} from "../../firebase";
import CommentSection from "../CommentSection/CommentSection";
import Footer from "../Footer/Footer";
import { render } from "enzyme";
import { useSelector } from "react-redux";
import Header from "../Header/Header";
import CommentInput from "../CommentSection/CommentInput";
import Comments from "../CommentSection/Comments";
import PostOptions from "../PostOptions/PostOptions";
const Post = (props) => {
  let feed = props.for;
  //TODO MAKE THIS A COMPONENT THAT SHOW DIFFERENTLY ON FEED AND POST PAGE
  //TODO MAKE THIS A COMPONENT THAT SHOW DIFFERENTLY ON FEED AND POST PAGE
  //declaring

  const [post, setPost] = useState(props.post);
  const [loading, setLoading] = useState(true);
  const { postid } = useParams();
  const [showComments, setShowComments] = useState("comments-hidden");
  const user = useSelector((state) => state.user.user);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCaption, setLikesCaption] = useState("");
  const [likesCount, setLikesCount] = useState(0);
  const [isIndividualPost, setIsIndividualPost] = useState(false);
  const [onPostPageStyling, setOnPostPageStyling] = useState("");
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
      if (checkIfUserIsSignedIn()) {
        sendLike(user, post.id).then(() => {
          setIsLiked(!isLiked);
          const newLikesCount = isLiked ? likesCount - 1 : likesCount + 1;
          setLikesCount(newLikesCount);
          setLikesCaption(
            `${newLikesCount} ${newLikesCount === 1 ? "like" : "likes"}`
          );
        });
      } else {
        signInWithGoogle();
      }
    } else {
      if (checkIfUserIsSignedIn()) {
        sendLike(user, postid).then(() => {
          setIsLiked(!isLiked);
          const newLikesCount = isLiked ? likesCount - 1 : likesCount + 1;
          setLikesCount(newLikesCount);
          setLikesCaption(
            `${newLikesCount} ${newLikesCount === 1 ? "like" : "likes"}`
          );
        });
      } else {
        signInWithGoogle();
      }
    }
  };

  // const [post, setPost] = useState(props.post);
  useEffect(() => {
    if (postid) {
      setIsIndividualPost(true);
      setOnPostPageStyling("desktop-individual-post");
      getPost(postid, null, (currentPost) => {
        setIsLiked(currentPost.likedBy.includes(user));
        setPost(currentPost);
        setLikesCount(currentPost.likedBy.length);
        if (currentPost.likedBy.length === 1) {
          setLikesCaption(`${currentPost.likedBy.length} like`);
        } else {
          setLikesCaption(`${currentPost.likedBy.length} likes`);
        }
        setLoading(false);
      });
    } else {
      setLikesCount(props.post.likedBy.length);
      setIsLiked(props.post.likedBy.includes(user));
      if (props.post.likedBy.length === 1) {
        setLikesCaption(`${props.post.likedBy.length} like`);
      } else {
        setLikesCaption(`${props.post.likedBy.length} likes`);
      }
      setLoading(false);
    }
  }, [user]);

  const handleShowComments = (device) => {
    if (checkIfUserIsSignedIn) {
      if (device === "mobile") {
        document.body.classList.add("no-scroll");
        setShowComments("comments-visible");
      }
    } else {
      signInWithGoogle();
    }
  };

  return (
    <>
      {loading ? (
        <>Loading...</>
      ) : (
        <>
          {postid ? <Header /> : null}
          <div className={`post-parent flex jc-c ai-c ${onPostPageStyling}`}>
            <div key={post.id} className="post padding">
              {/* user details*/}
              <div className={`user-details-feed flex fd-r ai-c`}>
                <Link to={`/user/${post.creator.uid}`}>
                  <div className="user-details-feed flex fd-r">
                    <img
                      src={post.creator.photoURL}
                      alt="profile photo"
                      referrerPolicy="no-referrer"
                    />
                    <div className="name-username">
                      <h5 className="display-name">
                        {post.creator.displayName}
                      </h5>
                      <h5 className="username">@{post.creator.username}</h5>
                    </div>
                  </div>
                </Link>
                {props.isCreatorOfPost ? <PostOptions post={post} /> : null}
              </div>
              {/* post photo */}
              <img
                src={post.photo}
                alt="photo"
                className="post-photo"
                referrerPolicy="no-referrer"
              />
              {/* post bottom content */}
              <div className="post-bottom-content flex fd-c">
                {/* user details for post page */}
                {isIndividualPost ? (
                  <div className="desktop user-details post-page-ud flex fd-r">
                    <Link to={`/user/${post.creator.uid}`}>
                      <>
                        <img
                          src={post.creator.photoURL}
                          alt="profile photo"
                          referrerPolicy="no-referrer"
                        />
                        <div className="name-username flex fd-c jc-c ">
                          <h5 className="display-name">
                            {post.creator.displayName}
                          </h5>
                          <h5 className="username">@{post.creator.username}</h5>
                        </div>
                      </>
                    </Link>
                    {user === post.creator.uid ? (
                      <PostOptions post={post} />
                    ) : null}
                  </div>
                ) : null}
                <Comments post={postid ? post : props.post} />
                {/* interact buttons */}
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
                  <button
                    className="mobile comment-button flex ai-c"
                    onClick={() => {
                      handleShowComments("mobile");
                    }}
                  >
                    <img src={commentIcon} alt="comment" className="icon" />
                  </button>
                  <Link to={`/post/${post.id}`} className="desktop">
                    <button className="comment-button flex ai-c">
                      <img src={commentIcon} alt="comment" className="icon" />
                    </button>
                  </Link>

                  <button className="share-button flex ai-c">
                    <img src={sendIcon} alt="share" className="icon" />
                  </button>
                </div>

                {/* likes indicator */}
                <h4 className="likes-indicator">{likesCaption}</h4>

                {/* caption content */}
                <div className="caption-content flex fd-r">
                  <Link to={`/user/${post.creator.uid}`}>
                    <p className="caption-author">{post.creator.username}</p>
                  </Link>
                  <p className="caption-text">{post.caption}</p>
                </div>

                {/* view comments */}
                <Link to={`/post/${post.id}`} className="desktop flex jc-fs">
                  <p
                    className="view-comments"
                    onClick={() => {
                      handleShowComments("PC");
                    }}
                  >
                    {comments(post, false)}
                  </p>
                </Link>
                <button
                  className="mobile view-comments"
                  onClick={() => {
                    handleShowComments("mobile");
                  }}
                >
                  {comments(post, false)}
                </button>
                {comments(post, true) < 2 ? null : (
                  <div className="comment flex fd-r ai-c">
                    <Link to={`/user/${post.comments[0].author}`}>
                      <p className="caption-author">
                        {post.comments[0].author_name}
                      </p>
                    </Link>
                    <p
                      className="caption-text"
                      onClick={() => {
                        handleShowComments("mobile");
                      }}
                    >
                      {post.comments[0].text}
                    </p>
                  </div>
                )}

                {/* add comment */}
                <Link to={`/post/${post.id}`} className="desktop flex jc-fs">
                  <p
                    className="view-comments"
                    onClick={() => {
                      handleShowComments("PC");
                    }}
                  >
                    Add comment...
                  </p>
                </Link>
                <button
                  className="mobile view-comments"
                  onClick={() => {
                    handleShowComments("mobile");
                  }}
                >
                  Add comment...
                </button>
                <CommentInput post={post} />
              </div>

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
          {postid ? <Footer /> : null}
        </>
      )}
    </>
  );
};

export default Post;
