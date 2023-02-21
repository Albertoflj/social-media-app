import React from "react";
import "./sendmessage.scss";
import send from "../../../assets/icons/send.svg";

const SendMessage = () => {
  return (
    <div>
      <form className="send-message flex ai-c">
        <input className="message-input" type="text" name="" id="" />
        <button className="send-button" type="submit">
          <img src={send} alt="Send" />
        </button>
      </form>
    </div>
  );
};

export default SendMessage;
