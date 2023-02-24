import React from "react";
import "./sendmessage.scss";
import send from "../../../assets/icons/send.svg";
import { addChatMessage } from "../../../firebase";
import { useSelector } from "react-redux";
import { useState } from "react";

const SendMessage = (props) => {
  const currentUser = useSelector((state) => state.user);
  const [errorMessage, setErrorMessage] = useState("Send message...");
  const [errorClass, setErrorClass] = useState("");
  const onSubmit = (e) => {
    e.preventDefault();
    //message should not be empty or only spaces or tabs or new lines etc
    //message should not be more than 200 characters
    if (
      e.target[0].value.trim() === "" ||
      e.target[0].value.trim().length > 200
    ) {
      setErrorMessage(
        e.target[0].value.trim() === ""
          ? "Message cannot be empty"
          : "Message cannot be more than 200 characters"
      );
      setErrorClass("error");
      e.target[0].value = "";
      return;
    }

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
        <input
          className={`message-input ${errorClass}`}
          type="text"
          name=""
          id=""
          disabled={props.disabled}
          placeholder={errorMessage}
        />
        <button className="send-button" type="submit" disabled={props.disabled}>
          <img src={send} alt="Send" />
        </button>
      </form>
    </div>
  );
};

export default SendMessage;
