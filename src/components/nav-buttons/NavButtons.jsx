import chatIcon from "../../assets/icons/chat-dots.svg";
import postIcon from "../../assets/icons/plus-square.svg";
import homeIcon from "../../assets/icons/house-door-fill.svg";
import "./nav-buttons.scss";

const NavButtons = (props) => {
  return (
    <div className="nav-buttons flex">
      <button className="post-button">
        <img src={postIcon} alt="post-icon" />
      </button>
      <button className="home-button">
        <img src={homeIcon} alt="home-icon" />
      </button>
      {props.for === "header" ? (
        <button className="messages-button">
          <img src={chatIcon} alt="chatIcon" />
        </button>
      ) : null}
      <button className="profile-button">
        <div className="profile-photo-placeholder"></div>
      </button>
    </div>
  );
};

export default NavButtons;
