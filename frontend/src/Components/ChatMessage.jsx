import { Bot } from "lucide-react";

const ChatMessage = ({ text, role, User }) => {
  const isUser = role === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } mb-4 animate-in slide-in-from-bottom duration-300`}
    >
      <div
        className={`flex items-start gap-3 max-w-[85%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center border shadow-sm ${
            isUser
              ? "bg-gray-100 border-gray-300"
              : "bg-white border-gray-300"
          }`}
        >
          {isUser ? (
            <img
              src={User.profilePic || "/avatar.png"}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <Bot className="w-4 h-4 text-gray-600" />
          )}
        </div>

        {/* Message Bubble */}
        <div
          className={`relative px-5 py-3 rounded-xl text-sm shadow-sm border ${
            isUser
              ? "bg-blue-50 text-gray-900 border-blue-100 rounded-br-md"
              : "bg-white text-gray-800 border-gray-200 rounded-bl-md"
          }`}
        >
          {/* Tail Arrow */}
          <div
            className={`absolute top-3 w-0 h-0 ${
              isUser
                ? "right-0 translate-x-full border-l-8 border-l-blue-50 border-t-4 border-t-transparent border-b-4 border-b-transparent"
                : "left-0 -translate-x-full border-r-8 border-r-white border-t-4 border-t-transparent border-b-4 border-b-transparent"
            }`}
          />

          <p className="leading-relaxed whitespace-pre-wrap">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
