import React from "react";
import { getAllPostsFromSpecificUser, getFollowingPosts } from "../../firebase";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import "./post.scss";
//buttons

import Post from "./Post";
import { useSelector } from "react-redux";

const Posts = () => {
  const posts = useSelector((state) => state.post.posts);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);
  const isFinishedFetching = useSelector(
    (state) => state.user.finishedFetching
  );

  useEffect(() => {
    if (user) {
      getFollowingPosts(user.uid);
    } else if (!user && isFinishedFetching) {
      getAllPostsFromSpecificUser("QahgWcwga4edVwhtJUBsqmDTMlQ2");
    }
    setLoading(false);
  }, [user]);

  return (
    <div>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div className="posts flex  fd-c ai-c">
          {posts.map((post, index) => (
            <Post
              post={post}
              key={post.id + index}
              isCreatorOfPost={user.uid === post.creator.uid}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
