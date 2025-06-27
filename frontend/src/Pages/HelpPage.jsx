import React, { useState } from "react";
import {
  Upload,
  MessageSquareText,
  Bot,
  BellRing,
  ShieldCheck,
  Info,
  Mail,
  SendHorizonal,
  ChevronDown,
} from "lucide-react";

const HelpPage = () => {
  const [showContactForm, setShowContactForm] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const features = [
    {
      icon: <Upload className="w-6 h-6 text-blue-600" />,
      title: "Smart Document Upload",
      description:
        "Upload PDFs or handwritten notes. We extract the content using OCR and prepare it for AI-based Q&A.",
    },
    {
      icon: <MessageSquareText className="w-6 h-6 text-indigo-600" />,
      title: "Chat with Notes",
      description:
        "Interact with your documents via AI. Ask questions and get context-aware answers from your materials.",
    },
    {
      icon: <Bot className="w-6 h-6 text-emerald-600" />,
      title: "General Assistant",
      description:
        "Use our AI for general questions, concepts, definitions, and clarifications.",
    },
    {
      icon: <BellRing className="w-6 h-6 text-yellow-500" />,
      title: "Reminders & Nudges",
      description:
        "Stay consistent with study goals via notifications (coming soon!).",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-pink-500" />,
      title: "Your Privacy First",
      description:
        "Choose visibility for uploads. We do not share your content without permission.",
    },
  ];

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    setFeedback("");
    // You can connect this to your backend API here.
  };

  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-5xl mx-auto space-y-12">

        {/* Header */}
        <div className="text-center space-y-2">
          <Info className="w-8 h-8 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Help & Support</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Everything you need to know to get started, stay organized, and make the most of your study assistant.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((item, idx) => (
            <div key={idx} className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm flex space-x-4 items-start">
              <div className="p-3 bg-white rounded-full shadow">{item.icon}</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <summary className="cursor-pointer font-medium text-gray-700">What files can I upload?</summary>
              <p className="mt-2 text-sm text-gray-600">PDF, JPG, PNG, and most common image types are supported.</p>
            </details>
            <details className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <summary className="cursor-pointer font-medium text-gray-700">Is my data private?</summary>
              <p className="mt-2 text-sm text-gray-600">Yes. Your data is never shared publicly unless marked otherwise by you.</p>
            </details>
            <details className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <summary className="cursor-pointer font-medium text-gray-700">How accurate are the answers?</summary>
              <p className="mt-2 text-sm text-gray-600">We use powerful LLMs and your uploaded context to give the best possible responses.</p>
            </details>
          </div>
        </div>

        {/* Contact Us */}
        <div className="mt-16 space-y-4">
          <button
            onClick={() => setShowContactForm(!showContactForm)}
            className="flex items-center gap-2 text-blue-600 font-semibold"
          >
            <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${showContactForm ? "rotate-180" : ""}`} />
            Contact Us
          </button>

          {showContactForm && (
            <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-200 space-y-4">
              <p className="text-gray-700 text-sm">
                For inquiries, support, or business queries, email us directly:
                <a href="mailto:support@yourdomain.com" className="ml-2 text-blue-700 underline">support@yourdomain.com</a>
              </p>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full border px-4 py-2 rounded-md"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full border px-4 py-2 rounded-md"
                />
                <textarea
                  rows={4}
                  placeholder="Your Message"
                  className="w-full border px-4 py-2 rounded-md"
                ></textarea>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition"
                >
                  <SendHorizonal className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Feedback Form */}
        <div className="mt-12 space-y-4">
          <button
            onClick={() => setShowFeedbackForm(!showFeedbackForm)}
            className="text-emerald-600 font-semibold flex items-center gap-2"
          >
            <ChevronDown className={`w-5 h-5 transition-transform ${showFeedbackForm ? "rotate-180" : ""}`} />
            Send Feedback
          </button>

          {showFeedbackForm && (
            <form
              onSubmit={handleFeedbackSubmit}
              className="bg-emerald-50/40 border border-emerald-200 rounded-xl p-6 space-y-4"
            >
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts, bugs, suggestions..."
                className="w-full border px-4 py-2 rounded-md"
                rows={4}
                required
              />
              <button
                type="submit"
                className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition"
              >
                Submit Feedback
              </button>
              {feedbackSubmitted && (
                <p className="text-sm text-emerald-700 mt-2">✅ Thank you! Your feedback was submitted.</p>
              )}
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default HelpPage;
