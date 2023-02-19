import React from "react";

const ConversationMessages = (props) => {
  let dummyData = props.messages;
  return (
    <div className="conversation-messages padding flex fd-c scrollbar-hidden">
      {dummyData.map((message) => {
        let ownMessage =
          message.id % 2 === 0 ? "own-message" : "not-own-message";
        return (
          <div
            key={message.id}
            className={`message flex fd-r padding ${ownMessage}`}
            tabIndex="0"
            aria-pressed="false"
          >
            <img
              src={message.image}
              alt={message.name}
              className="message-creator"
            />
            <div className="message-text">
              {/* <h3>{message.name}</h3> */}
              <p>{message.message}</p>
            </div>
          </div>
        );
      })}
      {dummyData.map((message) => {
        let ownMessage =
          message.id % 2 === 0 ? "own-message" : "not-own-message";
        return (
          <div
            key={message.id}
            className={`message flex fd-r padding ${ownMessage}`}
            tabIndex="0"
            aria-pressed="false"
          >
            <img
              src={message.image}
              alt={message.name}
              className="message-creator"
            />
            <div className="message-text">
              {/* <h3>{message.name}</h3> */}
              <p>{message.message}</p>
            </div>
          </div>
        );
      })}
      {dummyData.map((message) => {
        let ownMessage =
          message.id % 2 === 0 ? "own-message" : "not-own-message";
        return (
          <div
            key={message.id}
            className={`message flex fd-r padding ${ownMessage}`}
            tabIndex="0"
            aria-pressed="false"
          >
            <img
              src={message.image}
              alt={message.name}
              className="message-creator"
            />
            <div className="message-text">
              {/* <h3>{message.name}</h3> */}
              <p>{message.message}</p>
            </div>
          </div>
        );
      })}
      {dummyData.map((message) => {
        let ownMessage =
          message.id % 2 === 0 ? "own-message" : "not-own-message";
        return (
          <div
            key={message.id}
            className={`message flex fd-r padding ${ownMessage}`}
            tabIndex="0"
            aria-pressed="false"
          >
            <img
              src={message.image}
              alt={message.name}
              className="message-creator"
            />
            <div className="message-text">
              {/* <h3>{message.name}</h3> */}
              <p>{message.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationMessages;
