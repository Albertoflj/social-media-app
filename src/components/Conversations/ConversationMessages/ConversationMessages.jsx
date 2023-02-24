import React from "react";
import { useSelector } from "react-redux";

const ConversationMessages = (props) => {
  let dummyData = props.messages;
  const currentUserId = useSelector((state) => state.user.user);
  return (
    <div className="conversation-messages padding flex fd-c scrollbar-hidden">
      {dummyData
        ? dummyData.map((message) => {
            let ownMessage =
              message.sender === currentUserId
                ? "own-message"
                : "other-message";
            return (
              <div
                key={message.id}
                className={`message flex fd-r padding ${ownMessage}`}
                tabIndex="0"
                aria-pressed="false"
              >
                <img
                  src={message.photoURL}
                  alt={message.name}
                  className="message-creator"
                />
                <div className="message-text">
                  {/* <h3>{message.name}</h3> */}
                  <p>{message.message}</p>
                </div>
              </div>
            );
          })
        : null}
    </div>
  );
};

export default ConversationMessages;
