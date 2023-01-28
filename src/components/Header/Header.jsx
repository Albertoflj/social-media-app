import chatIcon from "../../assets/icons/chat-dots.svg";
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
      </div>
    </header>
  );
};

export default Header;
