import React from "react";
import { AiOutlineClose } from "react-icons/ai";

export const Header = () => {
  const handleClearStorageAndRefresh = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <header>
      <div className="container">
        <div className="header__wrapper">
          <h1>NWV</h1>
          <AiOutlineClose className="close" onClick={handleClearStorageAndRefresh} />
        </div>
      </div>
    </header>
  );
};
