import React from "react";
import {
  getAllPosts,
  getAllPostsFromSpecificUser,
  getFollowingPosts,
} from "../../firebase";
import { auth, signInWithGoogle, signOut } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import "./post.scss";
//buttons

import Post from "./Post";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const Posts = () => {
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]);
  const posts244 = useSelector((state) => state.post.posts);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);
  const [userExists, setUserExists] = useState(false);
  const isFinishedFetching = useSelector(
    (state) => state.user.finishedFetching
  );

  useEffect(() => {
    if (user) {
      setUserExists(true);
      getFollowingPosts(user.uid, (followingPosts) => {
        if (followingPosts) {
          setPosts((prevPosts) => {
            return [...prevPosts, ...followingPosts];
          });
        }
      });
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
          {posts244.map((post, index) => (
            <Post
              post={post}
              key={post.id + index}
              isCreatorOfPost={user && user.uid === post.creator.uid}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
