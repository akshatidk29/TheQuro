import React, { useEffect, useRef, useState } from "react";
import { GraduationCap, Bot, CheckCircle2 } from "lucide-react";
import { useDocStore } from "../Stores/useDocStore";
import { useChatStore } from "../Stores/useChatStore";
import ChatInput from "../Components/ChatInput";
import ChatMessage from "../Components/ChatMessage";

const ChatPage = ({ userEmail }) => {
  const { messages, loading, input, setInput, sendMessage, sendGeneralMessage } = useChatStore();
  const { getUserDocs, documents } = useDocStore();
  const [selectedCourse, setSelectedCourse] = useState("");

  const bottomRef = useRef(null);

  useEffect(() => {
    getUserDocs();
  }, []);


  const courseOptions = ["General Questions", ...new Set(documents.map((file) => file.course).filter(Boolean))];

  useEffect(() => {
    if (courseOptions.length && !selectedCourse) {
      setSelectedCourse(courseOptions[0]);
    }
  }, [courseOptions, selectedCourse]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="flex items-center px-6 py-5 border-b border-gray-200 shadow-sm">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h2 className="ml-3 text-lg font-semibold text-gray-800">Your Courses</h2>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {courseOptions.length === 0 && (
            <p className="text-sm text-gray-500 text-center mt-6">No courses found.</p>
          )}
          {courseOptions.map((course, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCourse(course)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-left transition-all duration-150
                ${selectedCourse === course
                  ? "bg-blue-100 text-blue-800 font-semibold border border-blue-300"
                  : "bg-white hover:bg-gray-100 text-gray-700 border border-transparent"
                }`}
            >
              <span>{course}</span>
              {selectedCourse === course && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
            </button>
          ))}
        </nav>
      </aside>

      {/* Chat Panel */}
      <main className="flex-1 flex flex-col max-h-9/10">
        {/* Header */}
        <header className="px-6 py-4 border-b bg-white shadow-sm">
          <h1 className="text-xl font-bold text-gray-800">
            {selectedCourse === "General Questions"
              ? "General Chat"
              : `Chatting about ${selectedCourse}`}
          </h1>

          <p className="text-sm text-gray-500">Ask anything from your study material</p>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-4xl mx-auto">

            {/* Welcome */}
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready to help you learn!</h3>
                <p className="text-gray-600">
                  {selectedCourse === "General Questions"
                    ? "Ask me anything — no course needed!"
                    : `Ask me anything about ${selectedCourse}`}
                </p>

              </div>
            )}

            {messages.map((msg, idx) => (
              <ChatMessage key={idx} text={msg.text} role={msg.role} />
            ))}

            {/* Typing... */}
            {loading && (
              <div className="flex items-start gap-3 mb-6 animate-in slide-in-from-bottom duration-500">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white px-6 py-4 rounded-xl shadow border border-gray-200">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-6 border-t bg-white">
          <div className="max-w-4xl mx-auto">
            <ChatInput
              userEmail={userEmail}
              course={selectedCourse}
              sendMessage={sendMessage}
              sendGeneralMessage={sendGeneralMessage}
              loading={loading}
              input={input}
              setInput={setInput}
            />

          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
