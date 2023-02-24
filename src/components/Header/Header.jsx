import chatIcon from "../../assets/icons/chat-dots.svg";

import "../../main-styles/main.scss";
import "./header.scss";
import NavButtons from "../nav-buttons/NavButtons";
import SearchBar from "../SearchBar/SearchBar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import { checkIfUserIsSignedIn, signInWithGoogle } from "../../firebase";

const Header = () => {
  const user = useSelector((state) => state.user.user);
  const location = useLocation();

  return (
    <header className="header padding flex ai-c jc-c">
      <div className="header-content flex ai-c fd-r">
        <Link to="/">
          <div id="logo">SMA</div>
        </Link>
        <SearchBar />

        <Link
          to={user ? "/messages" : location.pathname}
          className="mobile"
          onClick={() => {
            if (!checkIfUserIsSignedIn()) {
              signInWithGoogle();
            }
          }}
        >
          <img src={chatIcon} alt="chatIcon" />
        </Link>

        <div className="header-right-buttons desktop">
          <NavButtons for="header" />
        </div>
      </div>
    </header>
  );
};

export default Header;
