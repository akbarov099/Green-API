import { create } from "zustand";
import axios from "axios";

const INSTANCE_ID = "7105184505";   
const API_TOKEN = "d9d8f284291646fca042421005d547d8f40b609ae878447f80"; // API tokeningizni kiriting

const BASE_URL = `https://api.green-api.com/waInstance${INSTANCE_ID}`;
const SEND_API_URL = `${BASE_URL}/sendMessage/${API_TOKEN}`;
const RECEIVE_API_URL = `${BASE_URL}/receiveNotification/${API_TOKEN}`;
const DELETE_API_URL = (receiptId) => `${BASE_URL}/deleteNotification/${API_TOKEN}/${receiptId}`;

// 📌 Local storage'dan xabarlarni yuklash funksiyasi
const loadMessagesFromLocalStorage = () => {
  const storedMessages = localStorage.getItem("chatMessages");
  return storedMessages ? JSON.parse(storedMessages) : [];
};

// 📌 Local storage'ga xabarlarni saqlash funksiyasi
const saveMessagesToLocalStorage = (messages) => {
  localStorage.setItem("chatMessages", JSON.stringify(messages));
};

export const useChatStore = create((set, get) => ({
  messages: loadMessagesFromLocalStorage(), // Sahifa yangilansa, xabarlar saqlanib qoladi
  text: "",
  lastMessageIds: new Set(),

  setText: (text) => set({ text }),

  sendMessage: async () => {
    const { text, messages } = get();
    if (!text) return;

    try {
      await axios.post(SEND_API_URL, {
        chatId: "996990559993@c.us", 
        message: text,
      });

      const newMessages = [...messages, { text, fromMe: true }];
      set({ messages: newMessages, text: "" });

      saveMessagesToLocalStorage(newMessages); // 📌 Local storage'ga saqlash

      setTimeout(() => get().fetchMessages(), 2000);
    } catch (error) {
      console.error("❌ Xabar yuborishda xatolik:", error);
    }
  },

  fetchMessages: async (retryCount = 3) => {
    if (retryCount <= 0) return;

    try {
      const response = await axios.get(RECEIVE_API_URL);
      if (!response.data || !response.data.body) return;

      const { body, receiptId } = response.data;
      const msg = body.messageData?.textMessageData?.textMessage;

      if (msg) {
        set((state) => {
          if (!state.lastMessageIds.has(receiptId)) {
            const newMessageIds = new Set(state.lastMessageIds);
            newMessageIds.add(receiptId);

            const newMessages = [...state.messages, { text: msg, fromMe: false }];
            saveMessagesToLocalStorage(newMessages); // 📌 Local storage'ga saqlash

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
        console.log("❌ Rate limit oshib ketdi. 5 soniyadan keyin qayta urinib ko‘rilmoqda...");
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await get().fetchMessages(retryCount - 1);
      } else {
        console.error("❌ Xabarlarni olishda xatolik:", error);
      }
    }
  },
}));
