import React from "react";
import "./titletab.scss";
import backArrow from "../../assets/icons/arrow-left.svg";

const TitleTab = (props) => {
  return (
    <div className="title-tab padding flex jc-c">
      <div className="title-tab-content flex fd-r jc-c ai-c ">
        {/* arrow icon here */}
        <button className="flex jc-c ai-c" onClick={props.onBack}>
          <img src={backArrow}></img>
        </button>
        {/* Title */}
        <h3>{props.title}</h3>
        <img className="vsn" src={backArrow}></img>
      </div>
    </div>
  );
};

export default TitleTab;
