import React from "react";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import Posts from "../../components/Posts/Posts";
import UsernamePrompt from "../../components/UsernamePrompt/UsernamePrompt";

const MainPage = () => {
  return (
    <>
      <Header />
      <Posts />
      <Footer />
    </>
  );
};

export default MainPage;
