/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { GraduationCap, Bot, CheckCircle2 } from "lucide-react";
import { useDocStore } from "../Stores/useDocStore";
import { useChatStore } from "../Stores/useChatStore";
import ChatInput from "../Components/ChatInput";
import ChatMessage from "../Components/ChatMessage";
import { useAuthStore } from "../Stores/useAuthStore";

const ChatPage = ({ userEmail }) => {
  const { authUser } = useAuthStore();
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
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
          <div className="p-2 bg-gray-100 rounded-lg shadow-sm">
            <GraduationCap className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Your Courses</h2>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {courseOptions.length === 0 ? (
            <p className="text-sm text-gray-500 text-center mt-6">No courses found.</p>
          ) : (
            courseOptions.map((course, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCourse(course)}
                className={`flex items-center justify-between w-full px-4 py-2 rounded-lg text-left text-sm transition 
                ${selectedCourse === course
                    ? "bg-blue-50 text-blue-800 font-medium border border-blue-200"
                    : "bg-white hover:bg-gray-100 text-gray-700 border border-transparent"
                  }`}
              >
                <span className="truncate">{course}</span>
                {selectedCourse === course && (
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                )}
              </button>
            ))
          )}
        </nav>
      </aside>

      {/* Chat Panel */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="px-6 py-4 border-b bg-white shadow-sm">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-xl font-semibold text-gray-800">
              {selectedCourse === "General Questions"
                ? "General Chat"
                : `Chatting about ${selectedCourse}`}
            </h1>
            <p className="text-sm text-gray-500">
              {selectedCourse === "General Questions"
                ? "Ask any academic or non-course question"
                : "Ask questions related to this course's content"}
            </p>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-hidden bg-gray-50">
          <div className="h-full overflow-y-auto px-4 sm:px-6 py-6">
            <div className="max-w-4xl mx-auto">
              {/* Welcome Message */}
              {messages.length === 0 && (
                <div className="text-center py-12 text-gray-700">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow">
                    <Bot className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Ready to help you learn!</h3>
                  <p className="text-sm">
                    {selectedCourse === "General Questions"
                      ? "Ask me anything — no course needed!"
                      : `Ask me anything about ${selectedCourse}`}
                  </p>
                </div>
              )}

              {messages.map((msg, idx) => (
                <ChatMessage key={idx} text={msg.text} role={msg.role} User={authUser} />
              ))}

              {/* Typing Indicator */}
              {loading && (
                <div className="flex items-start gap-3 mb-6 animate-in slide-in-from-bottom duration-500">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shadow-sm">
                    <Bot className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="bg-white px-5 py-3 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
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
