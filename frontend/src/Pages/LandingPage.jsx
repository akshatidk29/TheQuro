/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Upload,
  MessageCircle,
  Brain,
  Star,
} from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Upload Lectures Seamlessly",
    description: "Upload your daily class notes, PDFs, images, or handwritten materials. Our platform organizes and understands your content using state-of-the-art OCR and RAG models.",
    link: "/home/user/upload"
  },
  {
    icon: MessageCircle,
    title: "Ask Questions Anytime",
    description: "Stuck on a topic? Just ask. Our AI agent will retrieve accurate answers from your own study materials instantly.",
    link: "/home/user/chat"
  }
];

const testimonials = [
  {
    name: "Akshat Mittal",
    role: "Computer Science Student",
    avatar: "https://media.licdn.com/dms/image/v2/D4E03AQFnjJ-yu_Lx9g/profile-displayphoto-shrink_200_200/B4EZRRhfvXGYAg-/0/1736534526748?e=2147483647&v=beta&t=ZygYa9qFXIvR-xNz-JAzX6-kx5Wxlzl09_jOZWDqU4k",
    content: "This completely changed how I study. I can now ask questions about my lecture notes and get instant answers. My GPA improved by 0.8 points!",
    rating: 5
  },
  {
    name: "Arihant Kumar Jain",
    role: "Medical Student",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTocaOitRWeAmaGheXqBkOw7lGLs_HtLd7NZQ&s",
    content: "The OCR (Optical Character Recognition) feature is absolutely incredible — it accurately reads and converts even my handwritten notes into digital text.",
    rating: 5
  },
  {
    name: "Vansh Pandey",
    role: "Engineering Student",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqn7TZ5wF4kitnkl0l_HRrIbl3Ln0UGHY-4g&s",
    content: "I love how it creates personalized study schedules for me. The AI knows exactly when I need to review topics before exams.",
    rating: 5
  }
];

const stats = [
  { number: "10+", label: "Active Students" },
  { number: "50+", label: "Documents Processed" },
  { number: "95%", label: "Accuracy Rate" },
  { number: "24/7", label: "AI Availability" }
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="min-h-screen flex items-center justify-center relative px-4 sm:px-8"
      >
        <div className="absolute inset-0"></div>
        <div className="relative z-10 max-w-6xl mx-auto text-center">

          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-bold leading-tight mb-6 bg-gradient-to-r from-gray-400 to-gray-800 bg-clip-text text-transparent"
          >
            Your Smart Study
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Companion
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-12"
          >
            Transform your learning experience with AI that understands your study materials.
            Upload, ask, and learn like never before with cutting-edge RAG technology.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button className="bg-black text-white px-8 py-4 rounded-full font-medium text-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center group">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </motion.section>

      <section className="my-40 py-10 bg-black backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-200 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-32 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to supercharge your learning journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group "
                onClick={() => window.location.href = feature.link}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                <div className="mt-6 flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                  <span className="text-sm font-medium">Learn More</span>
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">How It Works</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get started in three simple steps
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12 ">
            {[
              {
                step: "01",
                title: "Upload Your Materials",
                description: "Drag and drop your lecture notes, PDFs, images, or handwritten content. Our AI processes everything instantly.",
                icon: Upload
              },
              {
                step: "02",
                title: "Ask Questions",
                description: "Type your questions naturally. Our AI understands context and retrieves relevant information from your materials.",
                icon: MessageCircle
              },
              {
                step: "03",
                title: "Learn Smarter",
                description: "Get instant, accurate answers. Create study schedules, set reminders, and track your progress.",
                icon: Brain
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.3, duration: 0.8 }}
                className="text-center relative"
              >
                <div className="text-6xl font-bold text-gray-500 mb-4">{item.step}</div>
                <div className="w-20 h-20 bg-gradient-to-r from-gray-500 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed">{item.description}</p>

                {idx < 2 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.3 + 0.5, duration: 0.5 }}
                    className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2"
                  >
                    <ArrowRight className="w-8 h-8 text-blue-400" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto ">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">What Students Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of students who've transformed their learning
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
                className="bg-gray-600 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-400">{testimonial.name}</div>
                    <div className="text-sm text-gray-200">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-500/10 to-purple-500/20 backdrop-blur-sm rounded-3xl p-12 border border-white/10"
          >
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already learning smarter, not harder.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="bg-gray-400 text-white px-8 py-4 rounded-full font-medium text-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
                onClick={() => navigate("/home/user/dashboard")}
              >
                Start Now
              </button>
            </div>
          </motion.div>
        </div>
      </section>


    </div>
  );
};

export default LandingPage;