import React, { useEffect, useState } from "react";
import { getConversationMessages } from "../../../firebase";
import TitleTab from "../../TitleTab/TitleTab";
import ConversationMessages from "../ConversationMessages/ConversationMessages";
import SendMessage from "../SendMessage/SendMessage";
import "./conversation.scss";
import { doc, onSnapshot } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, query, orderBy } from "firebase/firestore";
import { db } from "../../../firebase";

const Conversation = (props) => {
  // console.log(props.conversationId);
  const messagesRef = collection(
    db,
    "conversationMessages",
    props.conversationId,
    "messages"
  );
  const messagesQuery = query(messagesRef, orderBy("timeSent"));
  const [messages] = useCollectionData(messagesQuery, { idField: "id" });

  // let dummyData = [
  //   {
  //     id: 1,
  //     name: "John Doe",
  //     message:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. sdahjkwqje qlwkeh qwjlke lqjeh wjlqkheqjk whekqj heqwjkhe qkjwhe qjkw ehqjklwehqwkljehqwkjeh qekjhqwelhqjw ",
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
  //   {
  //     id: 4,
  //     name: "John Doe",
  //     message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  //     image: "https://picsum.photos/300/300",
  //   },
  //   {
  //     id: 5,
  //     name: "John Doe",
  //     message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  //     image: "https://picsum.photos/300/300",
  //   },
  // ];

  return (
    <div className="conversation-messages-container mobile-large">
      <TitleTab title="John Doe" onBack={props.onBack} className="mobile" />
      <ConversationMessages messages={messages} />
      <SendMessage chatId={props.conversationId} />
    </div>
  );
};

export default Conversation;
