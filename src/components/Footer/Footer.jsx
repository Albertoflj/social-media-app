import NavButtons from "../nav-buttons/NavButtons";
import "./footer.scss";

const Footer = () => {
  return (
    <footer className="footer mobile">
      <div className="footer-content flex jc-c ai-c">
        <NavButtons />
      </div>
    </footer>
  );
};

export default Footer;
