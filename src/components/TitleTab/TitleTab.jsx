import React from "react";
import "./titletab.scss";
import backArrow from "../../assets/icons/arrow-left.svg";
import { useSelector } from "react-redux";

const TitleTab = (props) => {
  const userPhoto = useSelector((state) => state.user.photoURL);
  return (
    <div className="title-tab padding flex jc-c">
      <div className="title-tab-content flex fd-r jc-c ai-c ">
        {/* arrow icon here */}
        <button className="mobile-large flex jc-c ai-c" onClick={props.onBack}>
          <img src={backArrow}></img>
        </button>
        {/* User Profile Photo */}
        <img src={userPhoto} alt="" className="desktop-large" />
        {/* Title */}
        <h3>{props.title}</h3>
        <img className="vsn" src={backArrow}></img>
      </div>
    </div>
  );
};

export default TitleTab;
