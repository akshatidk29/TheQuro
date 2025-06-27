
import {Bot, User, Sparkles } from "lucide-react";

const ChatMessage = ({ text, role }) => {
  const isUser = role === "user";
  
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6 animate-in slide-in-from-bottom duration-500`}>
      <div className={`flex items-start gap-3 max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
          isUser 
            ? "bg-gradient-to-br from-blue-500 to-purple-600" 
            : "bg-gradient-to-br from-emerald-500 to-teal-600"
        }`}>
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </div>
        
        {/* Message Bubble */}
        <div className={`relative px-6 py-4 rounded-2xl shadow-md backdrop-blur-sm border transition-all duration-300 hover:shadow-lg ${
          isUser
            ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white border-blue-300/30 rounded-br-md"
            : "bg-white/90 text-gray-800 border-gray-200/50 rounded-bl-md"
        }`}>
          {/* Message tail */}
          <div className={`absolute top-4 w-0 h-0 ${
            isUser
              ? "right-0 translate-x-full border-l-[12px] border-l-blue-500 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent"
              : "left-0 -translate-x-full border-r-[12px] border-r-white/90 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent"
          }`} />
          
          <p className="text-sm leading-relaxed">{text}</p>
          
          {/* Sparkle effect for AI messages */}
          {!isUser && (
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default ChatMessage;