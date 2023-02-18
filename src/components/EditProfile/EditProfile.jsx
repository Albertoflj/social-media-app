import React from "react";
import "./editprofile.scss";
import { useState } from "react";
import { editProfile } from "../../firebase";

const EditProfile = (props) => {
  const [nameInputValue, setNameInputValue] = useState(props.user.displayName);
  const [bioInputValue, setBioInputValue] = useState(props.user.bio);
  const [nameErrorClass, setNameErrorClass] = useState("");
  const [bioErrorClass, setBioErrorClass] = useState("");
  const [nameError, setNameError] = useState("");
  const [bioError, setBioError] = useState("");
  const handleNameInputChange = (event) => {
    setNameInputValue(event.target.value);
  };
  const handleBioInputChange = (event) => {
    setBioInputValue(event.target.value);
  };
  // do not allow name to have any special characters and above 20 characters
  // do not allow bio to have any special characters and above 100 characters
  //do not allow name to be empty

  const checkName = (name) => {
    const regex = /^[a-zA-Z0-9 ]*$/;

    if (name.length > 20) {
      setNameError("Name must be less than 20 characters.");
      setNameInputValue("");
      return false;
    } else if (!regex.test(name)) {
      setNameError("Name must contain only letters, numbers, and spaces.");
      setNameInputValue("");
      return false;
    } else if (name.length === 0) {
      setNameError("Name cannot be empty.");
      setNameInputValue("");
      return false;
    }
    return true;
  };
  const checkBio = (bio) => {
    if (bio.length > 100) {
      setBioError("Bio must be less than 100 characters.");
      setBioInputValue("");
      return false;
    }
    return true;
  };

  const handleSave = (event) => {
    event.preventDefault();
    if (!checkName(nameInputValue)) {
      setNameErrorClass("error");
      return;
    }
    if (!checkBio(bioInputValue)) {
      setBioErrorClass("error");
      return;
    }

    editProfile(nameInputValue, bioInputValue).then((response) => {
      props.onExit();
    });
  };

  return (
    <div className="profile-editor-container flex fd-c ai-c">
      <div className="profile-photo-container">
        <div className="profile-photo-placeholder"></div>
        <img
          src={props.user.photoURL}
          alt="profile-photo"
          className="profile-photo"
        />
      </div>
      <form className="profile-input-form flex fd-c" onSubmit={handleSave}>
        <label htmlFor="name">Name:</label>
        {nameError && <p className="error-message">{nameError}</p>}
        <input
          type="text"
          name="name"
          className={nameErrorClass}
          value={nameInputValue}
          //   maxLength={20}
          onChange={handleNameInputChange}
        />
        <label htmlFor="bio">Bio:</label>
        {bioError && <p className="error-message">{bioError}</p>}
        <textarea
          type="text"
          name="bio"
          className={`bio-input ${bioErrorClass}`}
          value={bioInputValue}
          maxLength={100}
          onChange={handleBioInputChange}
        />
        <button className="profile-save-button" type="submit">
          Save
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
