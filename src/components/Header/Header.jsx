import chatIcon from "../../assets/icons/chat-dots.svg";
import postIcon from "../../assets/icons/plus-square.svg";
import homeIcon from "../../assets/icons/house-door-fill.svg";

import "../../main-styles/main.scss";
import "./header.scss";
const Header = () => {
  return (
    <header className="header padding flex ai-c jc-c">
      <div className="header-content flex fd-r">
        <div id="logo">SMA</div>
        <input type="text" id="search-bar" />
        <button id="messages-icon" className="mobile">
          <img src={chatIcon} alt="chatIcon" />
        </button>
        <div className="header-right-buttons desktop">
          <button className="post-button">
            <img src={postIcon} alt="post-icon" />
          </button>
          <button className="home-button">
            <img src={homeIcon} alt="home-icon" />
          </button>
          <button className="messages-button">
            <img src={chatIcon} alt="chatIcon" />
          </button>
          <button className="profile-button">
            <div className="profile-photo-placeholder"></div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
