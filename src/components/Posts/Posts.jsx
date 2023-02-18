import React from "react";
import { getFollowingPosts } from "../../firebase";
import { auth, signInWithGoogle, signOut } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import "./post.scss";
//buttons

import { Link } from "react-router-dom";
import Post from "./Post";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);

  // useEffect(() => {
  //   setPosts(dummyData);
  //   setLoading(false);
  //   console.log(dummyData);
  // }, []);

  useEffect(() => {
    if (user) {
      getFollowingPosts(user.uid, (followingPosts) => {
        // console.log(followingPosts);
        if (followingPosts) {
          setPosts(followingPosts);
        }
      });
    }
    console.log(posts);
    setLoading(false);
  }, [user]);

  return (
    <div>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div className="posts flex  fd-c ai-c">
          {posts.map((post) => (
            <Post post={post} key={post.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
