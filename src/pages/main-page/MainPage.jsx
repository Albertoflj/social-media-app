import React from "react";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import UsernamePrompt from "../../components/UsernamePrompt/UsernamePrompt";

const MainPage = () => {
  return (
    <>
      <Header />
      <UsernamePrompt />
      <Footer />
    </>
  );
};

export default MainPage;
