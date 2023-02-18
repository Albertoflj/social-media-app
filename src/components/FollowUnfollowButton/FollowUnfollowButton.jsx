import React from "react";

const FollowUnfollowButton = (props) => {
  return (
    <>
      {props.isFollowing ? (
        <button
          className="unfollow-button"
          onClick={() => {
            props.handleUnfollow();
          }}
        >
          Unfollow
        </button>
      ) : (
        <button
          className="follow-button"
          onClick={() => {
            props.handleFollow();
          }}
        >
          Follow
        </button>
      )}
    </>
  );
};

export default FollowUnfollowButton;
