import React from "react";
import { useChatStore } from "../store/useChatStore";
import { VscSend } from "react-icons/vsc";

export const Send = () => {
  const { text, setText, sendMessage } = useChatStore();

  return (
    <div className="send">
      <div className="container">
        <div className="send__wrapper">
          <input
            type="text"
            placeholder="Start typing..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <VscSend className="send__icon" onClick={sendMessage} />
        </div>
      </div>
    </div>
  );
};
