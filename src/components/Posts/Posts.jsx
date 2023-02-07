import React from "react";
import { getFollowingPosts } from "../../firebase";
import { auth, signInWithGoogle, signOut } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);
  useEffect(() => {
    if (user) {
      getFollowingPosts(user.uid, (followingPosts) => {
        // console.log(followingPosts);
        if (followingPosts) {
          setPosts(followingPosts);
        }
      });
      if (!loading) {
        console.log(posts);
      }
    }
    setLoading(false);
  }, [user]);

  return (
    <div>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div>
          {posts.map((post) => (
            <div>
              <h1>{post.user}</h1>
              <h2>{post.caption}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
