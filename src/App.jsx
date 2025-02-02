import React, { useState, useEffect } from "react";
import { Global } from "./Global";
import { Login } from "./Login";
import { useChatStore } from "./store/useChatStore";

export const App = () => {
  const { credentials, setCredentials } = useChatStore();
  const [isLoggedIn, setIsLoggedIn] = useState(!!credentials.API_TOKEN);

  useEffect(() => {
    if (credentials.API_TOKEN) {
      setIsLoggedIn(true);
    }
  }, [credentials]);

  return <>{isLoggedIn ? <Global /> : <Login onLogin={setCredentials} />}</>;
};
