import React from "react";
import { useState, useEffect } from "react";
import "./conversations.scss";
import Conversation from "./Conversation/Conversation";
import { getUserConversations } from "../../firebase";
import { useSelector } from "react-redux";

const Conversations = (props) => {
  const currentUser = useSelector((state) => state.user.user);
  const [conversations, setConversations] = useState([]);
  const [conversationId, setConversationId] = useState("");
  const [activeConversationId, setActiveConversationId] = useState(null);

  const handleConversationClick = (conversation) => {
    setShowConversation(true);
    setConversationId(conversation.id);
    props.onConversationClick(conversation.id);
    document.body.classList.add("no-scroll");

    if (activeConversationId !== null) {
      const prevConversation = document.getElementById(
        `conversation-${activeConversationId}`
      );
      prevConversation.classList.remove("selected-conversation");
    }
    const currentConversation = document.getElementById(
      `conversation-${conversation.id}`
    );
    currentConversation.classList.add("selected-conversation");
    setActiveConversationId(conversation.id);
  };

  const [showConversation, setShowConversation] = useState(false);

  useEffect(() => {
    getUserConversations(currentUser).then((conversations) => {
      conversations.map((conversation) => {
        setConversations((conversations) => [...conversations, conversation]);
        setConversations(
          (prevConversation) =>
            prevConversation &&
            prevConversation.filter(
              (v, i, a) => a.findIndex((t) => t.id === v.id) === i
            )
        );
      });
    });
  }, [currentUser]);

  return (
    <>
      <div className="conversations scrollbar-hidden flex fd-c">
        {conversations.map((conversation, index) => {
          const conversationId = `conversation-${conversation.id}`;
          return (
            <div
              key={conversationId}
              className={`conversation padding flex fd-r ai-c${
                index === 0 ? " active" : ""
              }`}
              role="button"
              tabIndex="0"
              aria-pressed="false"
              onClick={() => {
                handleConversationClick(conversation);
              }}
              id={conversationId}
            >
              {Object.values(conversation).map((conversationUser, index2) => {
                if (
                  conversationUser.userId === currentUser ||
                  !conversationUser.hasOwnProperty("username")
                ) {
                  return null;
                } else {
                  return (
                    <React.Fragment
                      key={`conversationUser-${index2}-${conversationUser.userId}`}
                    >
                      <img
                        src={conversationUser.photoURL}
                        alt={conversationUser.username}
                        key={`conversationPhoto-${index2}-${conversationUser.userId}`}
                        referrerPolicy="no-referrer"
                      />
                      <div
                        className="conversation-info"
                        key={`conversationInfo-${index2}-${conversationUser.userId}`}
                      >
                        <h3
                          key={`conversationUserName-${index2}-${conversationUser.userId}`}
                        >
                          {conversationUser.username}
                        </h3>
                        <p
                          key={`conversationLastMessage-${index2}-${conversationUser.userId}`}
                        >
                          {conversation.lastMessage.length > 40
                            ? conversation.lastMessage.slice(0, 40) + "..."
                            : conversation.lastMessage}
                        </p>
                      </div>
                    </React.Fragment>
                  );
                }
              })}
            </div>
          );
        })}
        <p className="acces-conv-warning padding">
          In order to access conversations with a user, you must first follow
          them.
        </p>
      </div>
      {showConversation && (
        <Conversation
          onBack={() => {
            setShowConversation(false);
          }}
          conversationId={conversationId}
          key={`conversation-${conversationId}`}
        />
      )}
    </>
  );
};

export default Conversations;
