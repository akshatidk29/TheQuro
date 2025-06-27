import { create } from "zustand";
import { axiosInstance } from "../Lib/axios.js";

export const useChatStore = create((set, get) => ({
  input: "",
  messages: [],
  loading: false,
  error: null,

  setInput: (value) => set({ input: value }),

  addUserMessage: (text, course) => {
    set((state) => ({
      messages: [...state.messages, { role: "user", text, course }],
    }));
  },

  addBotMessage: (text, course) => {
    set((state) => ({
      messages: [...state.messages, { role: "bot", text, course }],
    }));
  },

  resetChat: () => set({ messages: [], input: "", error: null }),

  sendMessage: async (userEmail, course) => {
    const { input, messages } = get();
    if (!input.trim()) return;

    get().addUserMessage(input, course);
    set({ loading: true, error: null });

    try {
      // Filter last 5 Q/A from the same course
      const lastQA = [];
      for (let i = messages.length - 1; i >= 0 && lastQA.length < 5; i--) {
        if (
          messages[i].role === "bot" &&
          messages[i].course === course &&
          messages[i - 1]?.course === course &&
          messages[i - 1]?.role === "user"
        ) {
          lastQA.push({
            question: messages[i - 1].text,
            answer: messages[i].text,
          });
        }
      }

      const response = await axiosInstance.post("/chat/query", {
        userEmail,
        course,
        currentQuestion: input,
        history: lastQA.reverse(), // Keep original order
      });

      const botReply =
        typeof response.data.answer === "string"
          ? response.data.answer
          : response.data.answer?.answer || JSON.stringify(response.data.answer);

      get().addBotMessage(botReply, course);
      set({ input: "" });
    } catch (err) {
      console.error("Chat error:", err);
      set({ error: err.response?.data?.message || "Something went wrong" });
    } finally {
      set({ loading: false });
    }
  },


  // 🆕 GENERAL CHAT HANDLER
  sendGeneralMessage: async (userEmail) => {
    const { input, messages } = get();
    if (!input.trim()) return;

    get().addUserMessage(input, "General");
    set({ loading: true, error: null });

    try {
      const lastQA = [];
      for (let i = messages.length - 1; i >= 0 && lastQA.length < 5; i--) {
        if (
          messages[i].role === "bot" &&
          messages[i].course === "General" &&
          messages[i - 1]?.course === "General" &&
          messages[i - 1]?.role === "user"
        ) {
          lastQA.push({
            question: messages[i - 1].text,
            answer: messages[i].text,
          });
        }
      }

      const response = await axiosInstance.post("/chat/general", {
        userEmail,
        currentQuestion: input,
        history: lastQA.reverse(),
      });

      const botReply =
        typeof response.data.answer === "string"
          ? response.data.answer
          : response.data.answer?.answer || JSON.stringify(response.data.answer);

      get().addBotMessage(botReply, "General");
      set({ input: "" });
    } catch (err) {
      console.error("General Chat Error:", err);
      set({ error: err.response?.data?.message || "Something went wrong" });
    } finally {
      set({ loading: false });
    }
  },
}));
