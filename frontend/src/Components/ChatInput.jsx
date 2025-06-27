
import { Send } from "lucide-react";

const ChatInput = ({ userEmail, course, sendMessage, loading, input, setInput, sendGeneralMessage }) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!loading && course && input.trim()) {
      if (course === "General Questions") {
        sendGeneralMessage(userEmail);
      } else {
        sendMessage(userEmail, course);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg">
        <div className="flex-1 relative">
          <input
            type="text"
            className="w-full bg-gray-50/50 border-0 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all duration-200 placeholder-gray-500"
            placeholder={course ? `Ask me anything about ${course}...` : "Select a course to start chatting"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading || !course}
          />

          {/* Loading indicator inside input */}
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !input.trim() || !course}
          className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
