import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore"; 

export const Chat = () => {
  const { messages, fetchMessages } = useChatStore();

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); 
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="chat">
      <div className="container">
        <div className="chat__messages">
          {messages.map((msg, index) => (
            
            <div key={index} className={msg.fromMe ? "message" : "answer"}>
              <p>{msg.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};