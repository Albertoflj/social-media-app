import React from "react";
import { Ring } from "@uiball/loaders";
import "./loader.scss";

const Loader = () => {
  return (
    <div className="loader flex jc-c ai-c">
      <Ring size={50} color="#202020" />
    </div>
  );
};

export default Loader;
