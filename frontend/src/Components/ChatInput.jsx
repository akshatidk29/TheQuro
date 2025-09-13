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
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const getPlaceholder = () => {
    if (!course) return "Select a course to start chatting";
    if (course === "General Questions") return "Ask me anything...";
    return `Ask me anything about ${course}...`;
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-3 p-3 bg-white/70 backdrop-blur-md border border-gray-300 rounded-xl shadow-md transition">
        <div className="relative flex-1">
          <input
            type="text"
            className="w-full px-4 py-3 pr-12 text-sm bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all placeholder-gray-500 disabled:bg-gray-100"
            placeholder={getPlaceholder()}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading || !course}
          />

          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !input.trim() || !course}
          className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
