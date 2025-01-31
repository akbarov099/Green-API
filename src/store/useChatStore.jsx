import { create } from "zustand";
import axios from "axios";

const API_URL =
  "https://7105.api.greenapi.com/waInstance7105183864/sendMessage/efc8912054b44188be3db44c164d47e5c59be81591034f5b96";
const RECEIVE_API_URL =
  "https://7105.api.greenapi.com/waInstance7105183864/receiveNotification/efc8912054b44188be3db44c164d47e5c59be81591034f5b96";
const CHAT_HISTORY_URL =
  "https://7105.api.greenapi.com/waInstance7105183864/getChatHistory/efc8912054b44188be3db44c164d47e5c59be81591034f5b96";

export const useChatStore = create((set, get) => ({
  messages: [],
  text: "",
  setText: (text) => set({ text }),

  // Xabar yuborish
  sendMessage: async () => {
    const { text, fetchMessages } = get(); // fetchMessagesni olish
    if (!text) return;

    try {
      await axios.post(API_URL, {
        chatId: "996990559993@c.us",
        message: text,
      });

      set((state) => ({
        messages: [...state.messages, { text, fromMe: true }],
        text: "",
      }));

      // fetchMessagesni chaqirish
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  },

  // Xabarlarni olish
  fetchMessages: async (retryCount = 3) => {
    try {
      const response = await axios.get(RECEIVE_API_URL);
      console.log(response.data); // Javobni log qilish
      if (response.data && response.data.body) {
        const msg =
          response.data.body.messageData?.textMessageData?.textMessage;
        if (msg) {
          set((state) => ({
            messages: [...state.messages, { text: msg, fromMe: false }],
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);

      // Agar xatolik 429 bo‘lsa, retry qilish
      if (error.response && error.response.status === 429 && retryCount > 0) {
        console.log("Retrying...");
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 second delay before retry
        fetchMessages(retryCount - 1);
      }
    }
  },

  // Chat tarixini olish
  fetchChatHistory: async (retryCount = 3) => {
    try {
      const response = await axios.post(CHAT_HISTORY_URL, {
        chatId: "996990559993@c.us",
        count: 20,
      });
      console.log(response.data); // Javobni log qilish
      if (response.data && Array.isArray(response.data)) {
        const chatMessages = response.data.map((msg) => ({
          text: msg.textMessage || "No message",
          fromMe: msg.senderId === "996990559993@c.us",
        }));

        set((state) => ({
          messages: [...chatMessages, ...state.messages],
        }));
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  },
}));
