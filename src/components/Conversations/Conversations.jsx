import React from "react";
import { useState, useEffect } from "react";
import "./conversations.scss";
import TitleTab from "../TitleTab/TitleTab";
import Conversation from "./Conversation/Conversation";
import { auth, getFollowingUsers, getUserChats } from "../../firebase";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { getAuth } from "firebase/auth";

const Conversations = (props) => {
  const [messages, setMessages] = useState([]);
  const currentUser = useSelector((state) => state.user.user);
  // const currentUserWithoutID = getAuth(auth);
  // const currentUser = currentUserWithoutID.currentUser.uid;
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
    setConversations([]);
    if (conversations.length === 0) {
      getFollowingUsers(currentUser).then((users) => {
        setFollowingUsers(users);
        users.slice(1).map((followingUser) => {
          getUserChats(currentUser, followingUser.uid).then((users) => {
            setConversations((conversations) => [...conversations, users]);
            //filter out duplicates
            setConversations(
              (prevConversation) =>
                prevConversation &&
                prevConversation.filter(
                  (v, i, a) => a.findIndex((t) => t.id === v.id) === i
                )
            );
          });
        });
      });
    }
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
