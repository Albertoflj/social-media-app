import React from "react";
import { useState, useEffect } from "react";
import "./conversations.scss";
import TitleTab from "../TitleTab/TitleTab";
import Conversation from "./Conversation/Conversation";
import { getFollowingUsers, getUserChats } from "../../firebase";
import { useSelector } from "react-redux";
import { useRef } from "react";

const Conversations = (props) => {
  const [messages, setMessages] = useState([]);
  const currentUser = useSelector((state) => state.user.user);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [conversationId, setConversationId] = useState("");
  const [activeConversationId, setActiveConversationId] = useState(null);

  const handleConversationClick = (conversation) => {
    setShowConversation(true);
    setConversationId(conversation.id);
    props.onConversationClick(conversation.id);

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
    getFollowingUsers(currentUser).then((users) => {
      setFollowingUsers(users);
      users.slice(1).map((followingUser) => {
        getUserChats(currentUser, followingUser.uid).then((users) => {
          console.log(users);
          setConversations((prevConversations) => [
            ...prevConversations,
            users,
          ]);
        });
      });
    });
  }, [currentUser]);
  // let dummyData = [
  //   {
  //     id: 1,
  //     name: "John Doe",
  //     message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  //     image: "https://picsum.photos/300/300",
  //   },
  //   {
  //     id: 2,
  //     name: "Jane Doe",
  //     message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  //     image: "https://picsum.photos/300/300",
  //   },
  //   {
  //     id: 3,
  //     name: "John Doe",
  //     message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  //     image: "https://picsum.photos/300/300",
  //   },
  // ];
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
                    <>
                      <img
                        key={`conversationPhoto-${index2}-${conversationUser.userId}`}
                        src={conversationUser.photoURL}
                        alt={conversationUser.username}
                      />
                      <div
                        className="conversation-info"
                        key={`conversation-${index2}-${conversationUser.userId}`}
                      >
                        <h3>{conversationUser.username}</h3>
                        <p>{conversation.lastMessage}</p>
                      </div>
                    </>
                  );
                }
              })}
            </div>
          );
        })}
      </div>
      {showConversation && (
        <Conversation
          onBack={() => {
            setShowConversation(false);
          }}
          conversationId={conversationId}
        />
      )}
    </>
  );
};

export default Conversations;
