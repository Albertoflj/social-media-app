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
  useEffect(() => {
    return () => {
      document.body.classList.remove("no-scroll");
      document.body.style.overflowY = "scroll";
    };
  }, []);

  const messagesRef = collection(
    db,
    "conversationMessages",
    props.conversationId,
    "messages"
  );
  const messagesQuery = query(messagesRef, orderBy("timeSent"));
  const [messages] = useCollectionData(messagesQuery, { idField: "id" });

  return (
    <div className="conversation-messages-container mobile-large">
      <TitleTab
        title={props.conversationId === "1" ? "Messages" : "Conversation"}
        onBack={props.onBack}
        className="mobile"
      />
      <ConversationMessages messages={messages} />
      <SendMessage chatId={props.conversationId} />
    </div>
  );
};

export default Conversation;
