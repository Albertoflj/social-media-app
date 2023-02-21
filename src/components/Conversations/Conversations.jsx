import React from "react";
import { useState, useEffect } from "react";
import "./conversations.scss";
import TitleTab from "../TitleTab/TitleTab";
import Conversation from "./Conversation/Conversation";
import { getFollowingUsers, getUserChats } from "../../firebase";
import { useSelector } from "react-redux";

const Conversations = () => {
  const [messages, setMessages] = useState([]);
  const currentUser = useSelector((state) => state.user.user);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const handleConversationClick = () => {
    setShowConversation(true);
  };
  const [showConversation, setShowConversation] = useState(false);
  useEffect(() => {
    getFollowingUsers(currentUser).then((users) => {
      setFollowingUsers(users);
      followingUsers.slice(1).map((followingUser) => {
        getUserChats(currentUser, followingUser).then((chats) => {
          setConversations((prev) => [...prev, chats]);
        });
      });
    });
  }, []);
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
      <div className="conversations scrollbar-hidden flex fd-c padding">
        {conversations.slice(1).map((conversation) => {
          return (
            <div
              key={conversation.uid}
              className="conversation flex fd-r ai-c"
              role="button"
              tabIndex="0"
              aria-pressed="false"
              onClick={handleConversationClick}
            >
              <img src={conversation.photoURL} alt={conversation.username} />
              <div className="conversation-info">
                <h3>{conversation.username}</h3>
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
