import React from "react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, limit, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";

const Comments = (props) => {
  const [loading, setLoading] = useState(true);

  //  const postCommentsCollectionRef = collection(db, "posts", postId, "comments");
  const postCommentsCollectionRef = collection(
    db,
    "posts",
    props.post.id,
    "comments"
  );
  const commentsQuery = query(
    postCommentsCollectionRef,
    orderBy("createdAt", "desc"),
    limit(100)
  );
  const [commentss] = useCollectionData(commentsQuery);
  const dummy = useRef();
  const commentsRef = useRef();

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
    <div className="comment-section-content padding">
      {loading ? (
        <>Loading..</>
      ) : (
        <div ref={commentsRef} className="comments flex fd-c padding">
          {commentss.map((comment, index) => (
            <div key={index} className="comment flex fd-r ai-c ">
              <img
                referrerPolicy="no-referrer"
                src={comment.author_photo}
                className="comment-photo"
              ></img>
              <div className="comment-content flex fd-c">
                <Link to={`/user/${comment.author}`}>
                  <h4 className="comment-username">{comment.author_name}</h4>
                </Link>
                <p className="comment-text">{comment.text}</p>
              </div>
            </div>
          ))}
          <div className="dumdiv" ref={dummy}></div>
        </div>
      )}
    </div>
  );
};

export default Comments;
