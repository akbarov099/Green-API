import React from "react";
import { useChatStore } from "../store/useChatStore";
import { VscSend } from "react-icons/vsc";

export const Send = () => {
  const { text, setText, sendMessage } = useChatStore();

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && text.trim() !== "") { 
      sendMessage();
    }
  };

  return (
    <div className="send">
      <div className="container">
        <div className="send__wrapper">
          <input
            type="text"
            placeholder="Start typing..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyPress} 
          />
          <VscSend
            className="send__icon"
            onClick={sendMessage}
          />
        </div>
      </div>
    </div>
  );
};
