import React from "react";
import { Header } from "./modules/Header";
import { Send } from "./modules/Send";
import { Chat } from "./modules/Chat";

export const Global = () => {
  return (
    <>
      <Header />
      <Chat/>
      <Send/>
    </>
  );
};
