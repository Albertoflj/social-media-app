import React, { useEffect } from "react";
import FollowUnfollowButton from "../FollowUnfollowButton/FollowUnfollowButton";
import "./followpanel.scss";
import { useState } from "react";
import { followUser, getUserData, unfollowUser } from "../../firebase";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import xIcon from "../../assets/icons/x.svg";

const FollowPanel = (props) => {
  const [followingActive, setFollowingActive] = useState(
    props.category === "following" ? "selected-follow" : ""
  );
  const [followersActive, setFollowersActive] = useState(
    props.category === "followers" ? "selected-follow" : ""
  );

  const [useEffectTrigger, setUseEffectTrigger] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const authUser = useAuthState(auth);
  const currentUser = authUser[0]?.uid;

  const handleFollow = (userUID) => {
    followUser(userUID).then(() => {
      setUseEffectTrigger(!useEffectTrigger);
    });
  };
  const handleUnfollow = (userUID) => {
    unfollowUser(userUID).then(() => {
      setUseEffectTrigger(!useEffectTrigger);
    });
  };

  useEffect(() => {
    let usersList = [];
    if (followingActive === "selected-follow") {
      //slices first user of array because it is the current user
      usersList = props.following.slice(1);
      setFollowingActive("selected-follow");
    } else {
      usersList = props.followers;
      setFollowersActive("selected-follow");
    }

    Promise.all(usersList.map((userUID) => getUserData(userUID))).then(
      (data) => {
        setUsers(data);
        setLoading(false);
      }
    );
  }, [useEffectTrigger]);

  const handleButtonClick = (buttonFor) => {
    if (buttonFor === "followers") {
      setLoading(true);
      setFollowingActive("");
      setFollowersActive("selected-follow");
      setUseEffectTrigger(!useEffectTrigger);
    } else {
      setLoading(true);
      setFollowingActive("selected-follow");
      setFollowersActive("");
      setUseEffectTrigger(!useEffectTrigger);
    }
  };

  return (
    <div className="follow-panel-container padding">
      <div className="follow-panel flex fd-c padding">
        <div className="follow-menu flex fd-r ai-c">
          <div className="follow-unfollow">
            <button
              className={`follow-select follow-following ${followingActive}`}
              onClick={() => {
                handleButtonClick("following");
              }}
            >
              Following
            </button>
            <button
              className={`follow-select follow-followers ${followersActive}`}
              onClick={() => {
                handleButtonClick("followers");
              }}
            >
              Followers
            </button>
          </div>
          {/* x icon */}
          <button
            className="x-icon"
            onClick={() => {
              props.onExit();
            }}
          >
            <img src={xIcon} alt="x" />
          </button>
        </div>
        <div className="follow-list flex fd-c padding">
          {loading ? (
            <>Loading</>
          ) : (
            <>
              {users.map((userProfile) => {
                return (
                  <div className="follow-user flex fd-r ai-c ">
                    <div className="user-profile-left-side flex fd-r ai-c">
                      <Link to={`/user/${userProfile.uid}`}>
                        <img
                          src={userProfile.photoURL}
                          className="image-placeholder"
                          referrerPolicy="no-referrer"
                          alt="profile-pht"
                        />
                      </Link>
                      <div className="user-names">
                        <Link to={`/user/${userProfile.uid}`}>
                          <h3>{userProfile.displayName}</h3>
                        </Link>
                        <h4>@{userProfile.username}</h4>
                      </div>
                    </div>

                    {userProfile.uid !== currentUser && (
                      <FollowUnfollowButton
                        isFollowing={userProfile.followers.includes(
                          currentUser
                        )}
                        handleFollow={() => {
                          handleFollow(userProfile.uid);
                        }}
                        handleUnfollow={() => {
                          handleUnfollow(userProfile.uid);
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowPanel;
