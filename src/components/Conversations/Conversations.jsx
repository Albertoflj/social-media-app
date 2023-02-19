import React from "react";
import { useState } from "react";
import "./conversations.scss";
import TitleTab from "../TitleTab/TitleTab";
import Conversation from "./Conversation/Conversation";

const Conversations = () => {
  const [messages, setMessages] = useState([]);
  const handleConversationClick = () => {
    setShowConversation(true);
  };
  const [showConversation, setShowConversation] = useState(false);

  let dummyData = [
    {
      id: 1,
      name: "John Doe",
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      image: "https://picsum.photos/300/300",
    },
    {
      id: 2,
      name: "Jane Doe",
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      image: "https://picsum.photos/300/300",
    },
    {
      id: 3,
      name: "John Doe",
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      image: "https://picsum.photos/300/300",
    },
  ];
  return (
    <>
      <div className="conversations scrollbar-hidden flex fd-c padding">
        {dummyData.map((conversation) => {
          return (
            <div
              key={conversation.id}
              className="conversation flex fd-r ai-c"
              role="button"
              tabIndex="0"
              aria-pressed="false"
              onClick={handleConversationClick}
            >
              <img src={conversation.image} alt={conversation.name} />
              <div className="conversation-info">
                <h3>{conversation.name}</h3>
                <p>{conversation.message}</p>
              </div>
            </div>
          );
        })}
      </div>
      {showConversation && (
        <Conversation
          onBack={() => {
            setShowConversation(false);
          }}
        />
      )}
    </>
  );
};

export default Conversations;
