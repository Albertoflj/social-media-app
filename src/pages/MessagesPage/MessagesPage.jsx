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
import { auth, db } from "../../firebase";
import { useSelector } from "react-redux";
import { useAuthState } from "react-firebase-hooks/auth";

const MessagesPage = () => {
  const [conversationId, setConversationId] = useState("");
  const [loggedIn, setLoggedIn] = useState(false); // add a state variable for login status

  const messagesRef = conversationId
    ? collection(db, "conversationMessages", conversationId, "messages")
    : collection(db, "conversationMessages", "1", "messages");

  const messagesQuery = query(messagesRef, orderBy("timeSent"));
  const [messages] = useCollectionData(messagesQuery, { idField: "id" });
  const [currentUser] = useAuthState(auth);

  useEffect(() => {
    setLoggedIn(!!currentUser); // set the login status when the currentUser changes
  }, [currentUser]);

  // render the component only when the user is logged in
  if (!loggedIn) {
    return null;
  }

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
          {conversationId ? (
            <SendMessage chatId={conversationId} disabled={false} />
          ) : (
            <SendMessage chatId={conversationId} disabled={true} />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MessagesPage;
