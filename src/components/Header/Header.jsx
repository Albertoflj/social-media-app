import chatIcon from "../../assets/icons/chat-dots.svg";

import "../../main-styles/main.scss";
import "./header.scss";
import NavButtons from "../nav-buttons/NavButtons";
const Header = () => {
  return (
    <header className="header padding flex ai-c jc-c">
      <div className="header-content flex ai-c fd-r">
        <div id="logo">SMA</div>
        <input type="text" id="search-bar" placeholder="Search" />
        <button id="messages-icon" className="mobile">
          <img src={chatIcon} alt="chatIcon" />
        </button>
        <div className="header-right-buttons desktop">
          <NavButtons for="header" />
        </div>
      </div>
    </header>
  );
};

export default Header;
