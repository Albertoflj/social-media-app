import chatIconOutline from "../../assets/icons/chat-dots.svg";
import chatIconFill from "../../assets/icons/chat-dots-fill.svg";
import postIconOutline from "../../assets/icons/plus-square.svg";
import postIconFill from "../../assets/icons/plus-square-fill.svg";
import homeIconOutline from "../../assets/icons/house-door.svg";
import homeIconFill from "../../assets/icons/house-door-fill.svg";
import userNotLoggedInIcon from "../../assets/icons/person.svg";

import { useLocation } from "react-router";
import "./nav-buttons.scss";
import { Link } from "react-router-dom";

import { auth, signInWithGoogle, signOut } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import UsernamePrompt from "../UsernamePrompt/UsernamePrompt";
import { checkIfUserHasUsername } from "../../firebase";

const NavButtons = (props) => {
  const [homeIcon, setHomeIcon] = useState(homeIconOutline);
  const [chatIcon, setChatIcon] = useState(chatIconOutline);
  const location = useLocation();
  useEffect(() => {
    switch (location.pathname) {
      case "/":
        setHomeIcon(homeIconFill);
        setChatIcon(chatIconOutline);
        break;
      case "/messages":
        setChatIcon(chatIconFill);
        setHomeIcon(homeIconOutline);
        break;
    }
  }, [location.pathname]);

  //TODO this is a temporary solution, if user is logged in, prompt to post, if not, prompt to sign in
  const checkIfUserIsLoggedIn = () => {
    if (user) {
      signOut();
    } else {
      signInWithGoogle();
    }
  };
  const [user] = useAuthState(auth);
  //   user ? console.log(user.photoURL) : console.log("user is not logged in");
  return (
    <div className="nav-buttons flex">
      {props.for === "header" ? (
        <>
          <button
            className="post-button"
            onClick={() => {
              checkIfUserIsLoggedIn();
            }}
          >
            <img src={postIconOutline} alt="post-icon" />
          </button>
          <Link to="/" className="home-button">
            <img src={homeIcon} alt="home-icon" />
          </Link>
          <Link to="/messages" className="messages-button">
            <img src={chatIcon} alt="chatIcon" />
          </Link>
        </>
      ) : (
        <>
          <Link to="/" className="home-button">
            <img src={homeIcon} alt="home-icon" />
          </Link>
          <button
            className="post-button"
            onClick={() => {
              checkIfUserIsLoggedIn();
            }}
          >
            <img src={postIconOutline} alt="post-icon" />
          </button>
        </>
      )}
      <Link
        to={user ? "/myprofile" : location.pathname}
        className="profile-button"
        onClick={() => {
          checkIfUserIsLoggedIn();
        }}
      >
        {user ? (
          <img
            src={user.photoURL}
            alt="profile-photo"
            className="profile-photo"
          />
        ) : (
          <img src={userNotLoggedInIcon} alt="user-icon" />
        )}
      </Link>
      {/* <UsernamePrompt /> */}
      {
        //if user is logged in, check if they have a username, if not, prompt them to create one
        // user && checkIfUserHasUsername(user.uid) === false ? (
        //   <UsernamePrompt />
        // ) : null
      }
    </div>
  );
};

export default NavButtons;
