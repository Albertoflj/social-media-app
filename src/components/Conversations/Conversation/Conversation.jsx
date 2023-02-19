import React from "react";
import TitleTab from "../../TitleTab/TitleTab";
import ConversationMessages from "../ConversationMessages/ConversationMessages";
import "./conversation.scss";

const Conversation = (props) => {
  let dummyData = [
    {
      id: 1,
      name: "John Doe",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. sdahjkwqje qlwkeh qwjlke lqjeh wjlqkheqjk whekqj heqwjkhe qkjwhe qjkw ehqjklwehqwkljehqwkjeh qekjhqwelhqjw ",
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
    {
      id: 4,
      name: "John Doe",
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      image: "https://picsum.photos/300/300",
    },
    {
      id: 5,
      name: "John Doe",
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      image: "https://picsum.photos/300/300",
    },
  ];

  return (
    <div className="conversation-messages-container">
      <TitleTab title="John Doe" onBack={props.onBack} className="mobile" />
      <ConversationMessages messages={dummyData} />
    </div>
  );
};

export default Conversation;
