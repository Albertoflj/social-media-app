import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import Backdrop from "../../components/Backdrop/Backdrop";
import EditProfile from "../../components/EditProfile/EditProfile";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import { followUser, getPost, getUserData, unfollowUser } from "../../firebase";
import "./profilepage.scss";

const ProfilePage = () => {
  const currentUser = useSelector((state) => state.user.user);
  const pageUser = useParams();
  const user = pageUser.userid;
  const [currentUserPage, setCurrentUserPage] = useState(false);
  const [userData, setUserData] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [followingUser, setFollowingUser] = useState(false);

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
        // sort the posts by date
        setUserPosts((prevUserPosts) => {
          return prevUserPosts.sort((a, b) => {
            return b.timestamp - a.timestamp;
          });
        });
      }
      // check if the current user is following the page user

      if (data.followers.includes(currentUser)) {
        setFollowingUser(true);
      }

      setLoading(false);
    });
  }, [user, currentUser, showEditProfile]);

  const handleUnfollow = () => {
    unfollowUser(user).then(setFollowingUser(false));
  };
  const handleFollow = () => {
    followUser(user).then(setFollowingUser(true));
  };
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
                className="profile-image"
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
                <button
                  className="edit-profile-button"
                  onClick={() => {
                    setShowEditProfile(true);
                  }}
                >
                  Edit Profile
                </button>
              ) : followingUser ? (
                <button
                  className="unfollow-button"
                  onClick={() => {
                    handleUnfollow();
                  }}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  className="follow-button"
                  onClick={() => {
                    handleFollow();
                  }}
                >
                  Follow
                </button>
              )}
            </div>
          </div>
          <div className="user-post-gallery flex fd-r">
            {userPosts ? (
              userPosts.map((post) => {
                return (
                  <Link
                    key={post.id}
                    to={`/post/${post.id}`}
                    className="post-photo-container"
                  >
                    <img className="post-img" src={post.photo} />
                  </Link>
                );
              })
            ) : (
              <>No post</>
              //   NEED TO ADD POST TIMESTAMP AND SORT POSTS BY TIME ON FEED
              // NEED TO ADD EDIT PROFILE POPUP
              // NEED TO ADD ALL FOLLOWERS AND FOLLOWING TABS (optional)
            )}
          </div>
          {showEditProfile ? (
            <>
              <EditProfile
                user={userData}
                onExit={() => setShowEditProfile(false)}
              />
              <Backdrop onCancel={() => setShowEditProfile(false)} />
            </>
          ) : null}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProfilePage;
