import { create } from "zustand";
import axios from "axios";

const API_URL = "https://7105.api.greenapi.com/waInstance7105184340/sendMessage/92d0730e6af845d28847de303596ffd9ed0a51865187493c86";
const RECEIVE_API_URL = "https://7105.api.greenapi.com/waInstance7105184340/receiveNotification/92d0730e6af845d28847de303596ffd9ed0a51865187493c86";

export const useChatStore = create((set, get) => ({
  messages: [],
  text: "",
  lastMessageIds: new Set(),
  setText: (text) => set({ text }),

  sendMessage: async () => {
    const { text, fetchMessages } = get();
    if (!text) return;

    await axios.post(API_URL, {
      chatId: "996990559993@c.us",
      message: text,
    });

    set((state) => ({
      messages: [...state.messages, { text, fromMe: true }],
      text: "",
    }));

    await fetchMessages();
  },

  fetchMessages: async (retryCount = 3) => {
    if (retryCount <= 0) return;

    try {
      const response = await axios.get(RECEIVE_API_URL);
      if (!response.data || !response.data.body) return;

      const msg = response.data.body.messageData?.textMessageData?.textMessage;
      const messageId = response.data.body.idMessage;
      const receiptId = response.data.receiptId;

      set((state) => {
        if (msg && !state.lastMessageIds.has(receiptId)) {
          const newMessageIds = new Set(state.lastMessageIds);
          newMessageIds.add(receiptId);

          return {
            messages: [...state.messages, { text: msg, fromMe: false }],
            lastMessageIds: newMessageIds,
          };
        }
        return state;
      });
    } catch (error) {
      if (error.response?.status === 429) {
        console.log("Rate limit reached, retrying...");
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await get().fetchMessages(retryCount - 1);
      } else {
        console.error("Error fetching messages:", error);
      }
    }
  },
}));
