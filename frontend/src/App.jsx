import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";


import { Loader, Upload } from "lucide-react";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

import LandingPage from "./Pages/LandingPage";
import LoginPage from "./Pages/LoginPage";
import SignUpPage from "./Pages/SignUpPage";
import HomePage from "./Pages/HomePage";
import HelpPage from "./Pages/HelpPage";
import UploadPage from "./Pages/UploadPage";
import ProfilePage from "./Pages/ProfilePage";
import DocumentPage from "./Pages/DocumentPage";

import { useAuthStore } from "./Stores/useAuthStore";
import ChatPage from "./Pages/ChatPage";
import SettingPage from "./Pages/SettingPage";
import TransactionPage from "./Pages/TransactionPage";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<LandingPage />} />

        {/* Auth-based pages */}
        <Route path="/home/user/dashboard" element={!authUser ? <LoginPage /> : <HomePage />} />
        <Route path="/home/user/upload" element={!authUser ? <LoginPage /> : <UploadPage />} />
        <Route path="/home/user/chat" element={!authUser ? <LoginPage /> : <ChatPage />} />

        <Route path="/home/user/profile/:userID" element={!authUser ? <LoginPage /> : <ProfilePage />} />

        <Route path="/home/user/settings" element={!authUser ? <LoginPage /> : <SettingPage />} />

        <Route path="/home/user/documents" element={!authUser ? <LoginPage /> : <DocumentPage />} />
        <Route path="/home/user/help" element={!authUser ? <LoginPage /> : <HelpPage />} />
        <Route path="/home/user/transactions" element={!authUser ? <LoginPage /> : <TransactionPage />} />

        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/home" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/home" />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;