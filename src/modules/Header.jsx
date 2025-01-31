import React from "react";
import { AiOutlineClose } from "react-icons/ai";

export const Header = () => {
  return (
    <header>
      <div className="container">
        <div className="header__wrapper">
          <h1>NWV</h1>
          <AiOutlineClose className="close" />
        </div>
      </div>
    </header>
  );
};
 