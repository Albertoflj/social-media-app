import React from "react";
import "./usernameprompt.scss";
import { useState } from "react";
import { checkIfUsernameExists } from "../../firebase";
const UsernamePrompt = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const checkforUsername = async (username) => {
    const result = await checkIfUsernameExists(username);
    // do something else here after firstFunction completes
  };
  const handleUsernameSubmission = (e) => {
    e.preventDefault();
    const username = e.target[0].value.toLowerCase();
    const regex = /^[a-zA-Z0-9_.]*$/;
    const minLength = 4;
    const maxLength = 12;
    let error = "";

    if (checkforUsername(username)) {
      error = "Username already exists";
    } else if (!regex.test(username)) {
      error =
        "Username can only contain letters, numbers, underscore and point";
    } else if (username.length < minLength) {
      error = `Username must be at least ${minLength} characters long`;
    } else if (username.length > maxLength) {
      error = `Username must be at most ${maxLength} characters long`;
    }
    if (error) {
      setErrorMessage(error);
    } else {
      console.log("can write to database");
    }
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
