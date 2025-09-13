import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../Stores/useAuthStore";
import {
  UploadCloud,
  FileText,
  MessageSquareText,
  ArrowRight,
} from "lucide-react";

const HomePage = () => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  const cards = [
    {
      title: "Upload Lectures",
      desc: "Upload your daily class notes, images, or PDFs to build your personal knowledge base.",
      icon: <UploadCloud className="w-7 h-7 text-blue-600" />,
      onClick: () => navigate("/home/user/upload"),
      gradient: "from-blue-500/10 to-cyan-500/10",
      borderColor: "hover:border-blue-400/50",
      bgAccent: "bg-blue-50",
    },
    {
      title: "Ask a Question",
      desc: "Ask anything from your uploaded material — our AI will fetch the most relevant answer.",
      icon: <MessageSquareText className="w-7 h-7 text-emerald-600" />,
      onClick: () => navigate("/home/user/chat"),
      gradient: "from-emerald-500/10 to-teal-500/10",
      borderColor: "hover:border-emerald-400/50",
      bgAccent: "bg-emerald-50",
    },
    {
      title: "Your Documents",
      desc: "Browse and manage your previously uploaded files and notes in one place.",
      icon: <FileText className="w-7 h-7 text-purple-600" />,
      onClick: () => navigate("/home/user/documents"),
      gradient: "from-purple-500/10 to-pink-500/10",
      borderColor: "hover:border-purple-400/50",
      bgAccent: "bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50">
      {/* Decorative Background Grid */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(to bottom,white,rgba(255,255,255,0.6))] -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight">
            Welcome back, {" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {authUser?.fullName?.split(" ")[0] || "User"}
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Transform your study experience with AI-powered insights from your own notes and materials.
          </p>
        </section>

        {/* Action Cards */}
        <section className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={card.onClick}
              className={`group relative rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden ${card.borderColor}`}
            >
              {/* Hover Gradient Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              ></div>

              <div className="relative p-8 flex flex-col h-full justify-between">
                {/* Icon */}
                <div className={`w-14 h-14 ${card.bgAccent} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  {card.icon}
                </div>

                {/* Title and Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-800">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                {/* Action Footer */}
                <div className="flex items-center text-sm font-medium text-gray-500 group-hover:text-indigo-600 transition-colors">
                  <span>Get started</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
