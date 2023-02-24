import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const ConversationMessages = (props) => {
  const messages = props.messages;
  const currentUserId = useSelector((state) => state.user.user);
  const messagesEndRef = useRef();

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [messages]);

  return (
    <div className="conversation-messages padding flex fd-c scrollbar-hidden">
      {messages
        ? messages.map((message, index) => {
            const ownMessage =
              message.sender === currentUserId
                ? "own-message"
                : "other-message";
            return (
              <div
                key={index + "-message"}
                className={`message flex fd-r padding ${ownMessage}`}
                tabIndex="0"
                aria-pressed="false"
              >
                <img
                  key={index + "-img"}
                  src={message.photoURL}
                  alt={message.name}
                  className="message-creator"
                />
                <div className="message-text" key={index + "-text"}>
                  <p key={index + "-msg"}>{message.message}</p>
                </div>
              </div>
            );
          })
        : null}
      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default ConversationMessages;
