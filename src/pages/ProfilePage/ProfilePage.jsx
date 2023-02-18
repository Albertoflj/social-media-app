import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import { getPost, getUserData } from "../../firebase";
import "./profilepage.scss";

const ProfilePage = () => {
  const currentUser = useSelector((state) => state.user.user);
  const pageUser = useParams();
  const user = pageUser.userid;
  const [currentUserPage, setCurrentUserPage] = useState(false);
  const [userData, setUserData] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser === user) {
      setCurrentUserPage(true);
    }

    getUserData(user).then((data) => {
      setUserData(data);
      if (data.userPosts) {
        data.userPosts.forEach((postId) => {
          getPost(postId, null, (postData) => {
            setUserPosts((prevUserPosts) => {
              if (prevUserPosts.some((post) => post.id === postData.id)) {
                // if the post is already in the array, return the previous state
                return prevUserPosts;
              } else {
                // otherwise, add the post to the array
                return [...prevUserPosts, postData];
              }
            });
          });
        });
      }
      setLoading(false);
    });
  }, [user, currentUser]);

  return (
    <div>
      <Header />
      {loading ? (
        <>Loading</>
      ) : (
        <div className="profile-container flex fd-c ai-c">
          <div className="profile-details flex fd-c ai-c">
            <div className="avatar-info">
              <img
                src={userData.photoURL}
                alt="profile photo"
                className="profile-image-replacer"
              />
              <div className="names">
                <h1>{userData.displayName}</h1>
                <h2>@{userData.username}</h2>
              </div>
              <div className="bio">
                <p>{userData.bio}</p>
              </div>
              <div className="activity-stats flex ">
                <div className="post-count">
                  <h2>{userData.userPosts.length}</h2>
                  <h1>Posts</h1>
                </div>
                <div className="following-count">
                  <h2>{userData.following.length}</h2>
                  <h1>Following</h1>
                </div>
                <div className="follower-count">
                  <h2>{userData.followers.length}</h2>
                  <h1>Followers</h1>
                </div>
              </div>

              {currentUserPage ? (
                <button className="edit-profile-button">Edit Profile</button>
              ) : (
                <button className="follow-button">Follow</button>
              )}
            </div>
          </div>
          <div className="user-post-gallery flex fd-r">
            {userPosts ? (
              userPosts.map((post) => {
                return (
                  <Link key={post.id} to={`/post/${post.id}`}>
                    <img className="img-replace" src={post.photo} />
                  </Link>
                );
              })
            ) : (
              <>No post</>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProfilePage;
