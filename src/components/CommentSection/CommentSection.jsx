import { useEffect, useState } from "react";
import { getUserData } from "../../firebase";
import Footer from "../Footer/Footer";
import TitleTab from "../TitleTab/TitleTab";
import "./commentsection.scss";

const CommentSection = (props) => {
  const [comments, setComments] = useState(props.comments);
  const [commentsPos, setCommentsPos] = useState(props.show);
  function onbacc() {
    // move oos
    setCommentsPos("left-oo-screen");
  }
  useEffect(() => {
    //NEED TO GET USER DATA AND PUT IT IN EACH COMMENT;
    //put comments in array
    Object.values(comments).map((comment) => {
      getUserData(comment.author).then((data) => {
        console.log(data);
      });
    });
    // getUserData
  }, []);
  return (
    <div className={`comment-section mobile ${commentsPos}`}>
      <TitleTab title="Comments" onBack={onbacc} />
      {Object.values(comments).map((comment, index) => (
        <div key={index}>
          <h1>{comment.author}</h1>
          <p>{comment.text}</p>
        </div>
      ))}

      {/* <Footer /> */}
    </div>
  );
};

export default CommentSection;
