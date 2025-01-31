import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore"; 

export const Chat = () => {
  const { messages, fetchMessages, fetchChatHistory } = useChatStore();

  useEffect(() => {
    fetchChatHistory();
    fetchMessages();
    const interval = setInterval(fetchChatHistory, 3000); 
    const interval2 = setInterval(fetchMessages, 3000); 
    // console.log(interval);
    // console.log(interval2);
    // return () => clearInterval(interval);
  }, []);

  // console.log(messages);

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