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
  let dummyData = [
    {
      caption: "Yessor",
      user: "QahgWcwga4edVwhtJUBsqmDTMlQ2",
      photo:
        "https://lh3.googleusercontent.com/a/AEdFTp7YQyJH_rv8rBKjuWmqpmbPvDVRhNd1dtFAelj8CQ=s96-c",
      comments: {
        0: {
          author: "dsaqdwqwd",
          text: "lololo",
        },
        1: {
          author: "asdwqdqwwewq",
          text: "dsadwqeq",
        },
      },
      creator: {
        displayName: "Le Zboy",
        email: "mcminecraftro@gmail.com",
        bio: "Hi! I'm new here.",
        username: "zent",
        uid: "QahgWcwga4edVwhtJUBsqmDTMlQ2",
        userPosts: ["cXWE74XGPLhQgoTHnSao", "IEibcRDH0KYVw8tv6e8x"],
        following: ["QahgWcwga4edVwhtJUBsqmDTMlQ2"],
        photoURL:
          "https://lh3.googleusercontent.com/a/AEdFTp7YQyJH_rv8rBKjuWmqpmbPvDVRhNd1dtFAelj8CQ=s96-c",
        followers: [],
      },
      id: "cXWE74XGPLhQgoTHnSao",
    },
    {
      user: "QahgWcwga4edVwhtJUBsqmDTMlQ2",
      photo: "dqwq",
      caption: "ytesssir",
      comments: {
        0: {
          author: "dkqjwdjkwq",
          text: "sdqweqw",
        },
      },
      creator: {
        displayName: "Le Zboy",
        email: "mcminecraftro@gmail.com",
        bio: "Hi! I'm new here.",
        username: "zent",
        uid: "QahgWcwga4edVwhtJUBsqmDTMlQ2",
        userPosts: ["cXWE74XGPLhQgoTHnSao", "IEibcRDH0KYVw8tv6e8x"],
        following: ["QahgWcwga4edVwhtJUBsqmDTMlQ2"],
        photoURL:
          "https://lh3.googleusercontent.com/a/AEdFTp7YQyJH_rv8rBKjuWmqpmbPvDVRhNd1dtFAelj8CQ=s96-c",
        followers: [],
      },
      id: "IEibcRDH0KYVw8tv6e8x",
    },
  ];

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
