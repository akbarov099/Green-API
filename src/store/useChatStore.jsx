import { create } from "zustand";
import axios from "axios";

const loadCredentials = () => {
  const stored = localStorage.getItem("apiCredentials");
  return stored ? JSON.parse(stored) : {};
};

export const useChatStore = create((set, get) => ({
  messages: JSON.parse(localStorage.getItem("chatMessages")) || [],
  text: "",
  lastMessageIds: new Set(),
  credentials: loadCredentials(),

  setText: (text) => set({ text }),

  setCredentials: (newCredentials) => {
    localStorage.setItem("apiCredentials", JSON.stringify(newCredentials));
    set({ credentials: newCredentials });
  },

  sendMessage: async () => {
    const { text, messages, credentials } = get();
    if (
      !text ||
      !credentials.API_TOKEN ||
      !credentials.INSTANCE_ID ||
      !credentials.CHAT_ID
    )
      return;

    const BASE_URL = `https://api.green-api.com/waInstance${credentials.INSTANCE_ID}`;
    const SEND_API_URL = `${BASE_URL}/sendMessage/${credentials.API_TOKEN}`;

    try {
      await axios.post(SEND_API_URL, {
        chatId: credentials.CHAT_ID,
        message: text,
      });

      const newMessages = [...messages, { text, fromMe: true }];
      set({ messages: newMessages, text: "" });
      localStorage.setItem("chatMessages", JSON.stringify(newMessages));
    } catch (error) {
      console.error("❌ Xabar yuborishda xatolik:", error);
    }
  },

  fetchMessages: async (retryCount = 3) => {
    if (retryCount <= 0) return;

    const { credentials } = get();
    if (
      !credentials.API_TOKEN ||
      !credentials.INSTANCE_ID ||
      !credentials.CHAT_ID
    )
      return;

    const BASE_URL = `https://api.green-api.com/waInstance${credentials.INSTANCE_ID}`;
    const RECEIVE_API_URL = `${BASE_URL}/receiveNotification/${credentials.API_TOKEN}`;
    const DELETE_API_URL = (receiptId) =>
      `${BASE_URL}/deleteNotification/${credentials.API_TOKEN}/${receiptId}`;

    try {
      const response = await axios.get(RECEIVE_API_URL);
      if (!response.data || !response.data.body) return;

      const { body, receiptId } = response.data;
      const msg = body.messageData?.textMessageData?.textMessage;
      const senderChatId = body.senderData?.chatId;

      if (msg && senderChatId === credentials.CHAT_ID) {
        set((state) => {
          if (!state.lastMessageIds.has(receiptId)) {
            const newMessageIds = new Set(state.lastMessageIds);
            newMessageIds.add(receiptId);

            const newMessages = [
              ...state.messages,
              { text: msg, fromMe: false },
            ];
            localStorage.setItem("chatMessages", JSON.stringify(newMessages));

            return {
              messages: newMessages,
              lastMessageIds: newMessageIds,
            };
          }
          return state;
        });
        await axios.delete(DELETE_API_URL(receiptId));
      }
    } catch (error) {
      if (error.response?.status === 429) {
        console.log(
          "❌ Rate limit oshib ketdi. 5 soniyadan keyin qayta urinib ko‘rilmoqda..."
        );
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await get().fetchMessages(retryCount - 1);
      } else {
        console.error("❌ Xabarlarni olishda xatolik:", error);
      }
    }
  },
}));
