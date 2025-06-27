import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../Stores/useAuthStore";
import { UploadCloud, FileText, MessageSquareText } from "lucide-react";

const HomePage = () => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  const cards = [
    {
      title: "Upload Lectures",
      desc: "Upload your daily class notes, images, or PDFs to build your personal knowledge base.",
      icon: <UploadCloud className="text-blue-600" />,
      onClick: () => navigate("/home/user/upload"),
    },
    {
      title: "Ask a Question",
      desc: "Ask anything from your uploaded material — our AI will fetch the most relevant answer.",
      icon: <MessageSquareText className="text-green-600" />,
      onClick: () => navigate("/home/user/chat"),
    },
    {
      title: "Your Documents",
      desc: "Browse and manage your previously uploaded files and notes in one place.",
      icon: <FileText className="text-purple-600" />,
      onClick: () => navigate("/home/user/documents"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-purple-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Welcome, {authUser?.fullName?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-600 mb-10">
          Smart assistant to help you prep better with your own notes.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => (
            <div
              key={i}
              onClick={card.onClick}
              className="bg-white rounded-2xl shadow hover:shadow-xl transition cursor-pointer p-6 border hover:border-indigo-300"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-800">{card.title}</h2>
                {card.icon}
              </div>
              <p className="text-sm text-gray-500">{card.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-gray-400">
          📅 Schedule reminders, AI summaries & quizzes coming soon 🚀
        </div>
      </div>
    </div>
  );
};

export default HomePage;
