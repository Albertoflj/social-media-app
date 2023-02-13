import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import emptyHeart from "../../assets/icons/heart.svg";
import commentIcon from "../../assets/icons/chat.svg";
import sendIcon from "../../assets/icons/send.svg";

import { useParams } from "react-router-dom";
import { getPost } from "../../firebase";
import CommentSection from "../CommentSection/CommentSection";
import Footer from "../Footer/Footer";
const Post = (props) => {
  let feed = props.for;

  //TODO MAKE THIS A COMPONENT THAT SHOW DIFFERENTLY ON FEED AND POST PAGE
  //declaring

  const [post, setPost] = useState(props.post);
  const [loading, setLoading] = useState(true);
  const { postid } = useParams();
  const comments = (object, forCount) => {
    let count = object.commentsLength;
    let phrase = "";
    if (count > 1) {
      phrase = `View all ${count} comments`;
    }
    //  else if (count === 1) {
    //   phrase = `View comment`;
    // }
    if (forCount) {
      return count;
    } else {
      return phrase;
    }
  };
  //need to add comment component IF on mobile, open comment tab
  //without going to that post's link
  //ELSE (if on computer), go to the post link
  //logic: check on press of button if screen width is of mobile or computer

  // const [post, setPost] = useState(props.post);
  useEffect(() => {
    if (postid) {
      getPost(postid, null, (currentPost) => {
        setPost(currentPost);
        setLoading(false);
        console.log(post);
      });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <>
      {loading ? (
        <>Loading...</>
      ) : (
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
            <button className="like-button flex ai-c jc-c">
              <img src={emptyHeart} alt="heart" className="icon" />
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
          {/* {Object.values(post.comments).map((comment, index) => (
      <div key={index}>
        <h1>{comment.author}</h1>
        <p>{comment.text}</p>
      </div>
    ))} */}
          <Link to={`/post/${post.id}`} className="flex jc-fs">
            <p className="view-comments">{comments(post, false)}</p>
          </Link>
          {
            <div className="comment flex fd-r ai-c">
              <Link replace to={`/user/${post.comments[0].author_name}`}>
                <p className="caption-author">{post.comments[0].author_name}</p>
              </Link>
              <p className="caption-text">{post.comments[0].text}</p>
            </div>
          }
          <Link to={`/post/${post.id}`} className="flex jc-fs">
            <p className="view-comments">Add comment...</p>
          </Link>
          <CommentSection comments={post.comments} post={post} />
          <Footer />
        </div>
      )}
    </>
  );
};

export default Post;
