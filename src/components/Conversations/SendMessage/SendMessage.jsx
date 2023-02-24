import React from "react";
import "./sendmessage.scss";
import send from "../../../assets/icons/send.svg";
import { addChatMessage } from "../../../firebase";
import { useSelector } from "react-redux";

const SendMessage = (props) => {
  const currentUser = useSelector((state) => state.user);
  const onSubmit = (e) => {
    e.preventDefault();

    const senderData = {
      message: e.target[0].value,
      userId: currentUser.user,
      username: currentUser.username,
      photoURL: currentUser.photoURL,
    };
    addChatMessage(props.chatId, senderData).then(() => {
      e.target[0].value = "";
    });
  };

  return (
    <div>
      <form className="send-message flex ai-c" onSubmit={onSubmit}>
        <input className="message-input" type="text" name="" id="" />
        <button className="send-button" type="submit">
          <img src={send} alt="Send" />
        </button>
      </form>
    </div>
  );
};

export default SendMessage;
