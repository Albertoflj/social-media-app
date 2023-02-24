import React, { useEffect } from "react";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import Conversations from "../../components/Conversations/Conversations";
import TitleTab from "../../components/TitleTab/TitleTab";

import "./messagespage.scss";
import ConversationMessages from "../../components/Conversations/ConversationMessages/ConversationMessages";
import SendMessage from "../../components/Conversations/SendMessage/SendMessage";
import { useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";

const MessagesPage = () => {
  const [conversationId, setConversationId] = useState("");
  //need to change this, if there is no conversationId, it should be the one with
  // the one with me
  const messagesRef = conversationId
    ? collection(db, "conversationMessages", conversationId, "messages")
    : collection(db, "conversationMessages", "1", "messages");

  const messagesQuery = query(messagesRef, orderBy("timeSent"));
  const [messages] = useCollectionData(messagesQuery, { idField: "id" });

  return (
    <div className="messages-page">
      <Header />
      <div className="conversations-container flex fd-r">
        <div className="conversations-with-title">
          <TitleTab title="Messages" />
          <Conversations onConversationClick={(id) => setConversationId(id)} />
        </div>
        <div className="desktop-messages desktop-large">
          <div className="desktop">
            <ConversationMessages messages={messages} />
          </div>
          <SendMessage chatId={conversationId} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MessagesPage;
