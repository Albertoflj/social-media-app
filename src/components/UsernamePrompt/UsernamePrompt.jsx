import React from "react";
import "./usernameprompt.scss";
import { useState } from "react";
import { checkIfUsernameExists, writeUsername } from "../../firebase";
import { useDispatch } from "react-redux";
import { setUsername } from "../../redux/userSlice";
const UsernamePrompt = (props) => {
  const [errorMessage, setErrorMessage] = useState(null);

  const checkforUsername = async (username) => {
    const result = await checkIfUsernameExists(username);
    return result;
    // do something else here after firstFunction completes
  };
  let dispatch = useDispatch();
  const handleUsernameSubmission = (e) => {
    e.preventDefault();
    const username = e.target[0].value.toLowerCase();
    const regex = /^[a-zA-Z0-9_.]*$/;
    const minLength = 4;
    const maxLength = 12;
    let error = "";

    checkforUsername(username).then((result) => {
      if (result) {
        error = "Username already exists";
      }
      if (!regex.test(username)) {
        error = "Username can only contain letters, numbers, and _";
      }
      if (username.length < minLength) {
        error = `Username must be at least ${minLength} characters long`;
      }
      if (username.length > maxLength) {
        error = `Username must be less than ${maxLength} characters long`;
      }
      if (error) {
        setErrorMessage(error);
      } else {
        writeUsername(username);
        dispatch(setUsername(username));
      }
    });
  };
  return (
    <div className="username-prompt flex center padding fd-c">
      <div className="username-prompt-content padding flex fd-c center">
        <h2>Join the fun with a unique username of your own!</h2>
        <p>You cannot change it later*</p>
        <form onSubmit={handleUsernameSubmission}>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <input type="text" placeholder="@username" />
        </form>
      </div>
    </div>
  );
};

export default UsernamePrompt;
