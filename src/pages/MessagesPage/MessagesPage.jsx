import React from "react";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import Conversations from "../../components/Conversations/Conversations";
import TitleTab from "../../components/TitleTab/TitleTab";

import "./messagespage.scss";
import ConversationMessages from "../../components/Conversations/ConversationMessages/ConversationMessages";

const MessagesPage = () => {
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
    <div className="messages-page">
      <Header />
      <div className="conversations-container flex fd-r">
        <div className="conversations-with-title">
          <TitleTab title="Messages" />
          <Conversations />
        </div>
        <div className="desktop-messages">
          <div className="desktop-large">
            <ConversationMessages messages={dummyData} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MessagesPage;
