import React from "react";
import { checkIfUserIsSignedIn, signInWithGoogle } from "../../firebase";
import "./followunfollowbuttons.scss";

const FollowUnfollowButton = (props) => {
  return (
    <>
      {props.isFollowing ? (
        <button
          className="unfollow-button"
          onClick={() => {
            if (checkIfUserIsSignedIn()) props.handleUnfollow();
            else signInWithGoogle();
          }}
        >
          Unfollow
        </button>
      ) : (
        <button
          className="follow-button"
          onClick={() => {
            if (checkIfUserIsSignedIn()) props.handleFollow();
            else signInWithGoogle();
          }}
        >
          Follow
        </button>
      )}
    </>
  );
};

export default FollowUnfollowButton;
