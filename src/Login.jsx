import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Login = ({ onLogin }) => {
  const [instanceId, setInstanceId] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [chatId, setChatId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!instanceId || !apiToken || !chatId) {
      toast.error("Please fill in all fields!");
      return;
    }

    const credentials = {
      INSTANCE_ID: instanceId,
      API_TOKEN: apiToken,
      CHAT_ID: chatId,
    };
    localStorage.setItem("apiCredentials", JSON.stringify(credentials));
    toast.success("Login successful!");
    onLogin(credentials);
  };

  return (
    <>
      <ToastContainer />
      <div className="login__wrapper">
        <div className="container">
          <form onSubmit={handleSubmit}>
            <h1>NWV</h1>
            <input
              type="text"
              placeholder="Instance ID"
              value={instanceId}
              onChange={(e) => setInstanceId(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="API Token"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Chat ID 996505333233@c.us"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              required
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </>
  );
};
