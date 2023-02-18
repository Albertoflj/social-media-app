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

import { Link } from "react-router-dom";
import Post from "./Post";
import { useSelector } from "react-redux";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);
  const [userExists, setUserExists] = useState(false);
  const isFinishedFetching = useSelector(
    (state) => state.user.finishedFetching
  );

  // useEffect(() => {
  //   setPosts(dummyData);
  //   setLoading(false);
  //   console.log(dummyData);
  // }, []);

  useEffect(() => {
    if (user) {
      setUserExists(true);
      getFollowingPosts(user.uid, (followingPosts) => {
        // console.log(followingPosts);
        if (followingPosts) {
          setPosts((prevPosts) => {
            const newPosts = followingPosts.filter(
              (followingPost) =>
                !prevPosts.some((prevPost) => prevPost.id === followingPost.id)
            );
            return [...prevPosts, ...newPosts];
          });
        }
      });
    } else if (!user && isFinishedFetching) {
      getAllPostsFromSpecificUser(
        "QahgWcwga4edVwhtJUBsqmDTMlQ2",
        (guestPosts) => {
          if (guestPosts) {
            setPosts(guestPosts);
          }
        }
      );
    }
    setLoading(false);
  }, [user]);

  return (
    <div>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div className="posts flex  fd-c ai-c">
          {posts.map((post) => (
            <Post
              post={post}
              key={post.id}
              isCreatorOfPost={user && user.uid === post.creator.uid}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
