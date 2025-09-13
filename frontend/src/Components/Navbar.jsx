/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LogOut,
  LayoutDashboard,
  UserCircle2,
  Upload,
  MessageCircle,
  FileText,
  Settings,
  TrendingUp,
  HelpCircle,
} from "lucide-react";
import { useAuthStore } from "../Stores/useAuthStore";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser, checkAuth, logout, isCheckingAuth } = useAuthStore();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);
  const handleLogout = async () => {
    await logout();
    navigate("/login");
    setIsProfileDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: "Dashboard", path: "/home/user/dashboard", icon: LayoutDashboard },
    { name: "Upload", path: "/home/user/upload", icon: Upload },
    { name: "Chat", path: "/home/user/chat", icon: MessageCircle },
    { name: "Documents", path: "/home/user/documents", icon: FileText },
  ];

  return (
    <nav className="bg-white/70 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3">
        {/* Brand Logo */}
        <Link
          to="/home"
          className="text-2xl font-extrabold tracking-tight text-gray-900 hover:opacity-90 transition"
        >
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            TheQuro
          </span>
        </Link>

        {/* Navigation Links */}
        {authUser && (
          <div className="flex items-center gap-1">
            {navItems.map(({ name, path, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${isActive(path)
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
              >
                <Icon size={18} />
                {name}
              </Link>
            ))}
          </div>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {authUser ? (
            <>
              {!isCheckingAuth ? (
                <Link
                  to="/home/user/transactions"
                  className="flex items-center px-3 py-1 rounded-md bg-gray-100 text-gray-800 text-sm font-medium hover:bg-gray-200 transition-colors border border-gray-200"
                >
                  <TrendingUp size={16} className="mr-1 text-blue-600" />
                  {authUser.tokens || 0} Tokens
                </Link>
              ) : (
                <span className="text-sm text-gray-400">Loading tokens...</span>
              )}

              <Link
                to="/home/user/help"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              >
                <HelpCircle size={20} />
              </Link>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img
                      src={authUser.profilePic || "/avatar.png"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    {authUser.fullName?.split(" ")[0]}
                  </span>
                </button>

                {/* Dropdown Panel */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl py-3 z-50">
                    <div className="px-4 pb-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {authUser.fullName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {authUser.email}
                      </p>
                    </div>

                    <Link
                      to={`/home/user/profile/${authUser?._id}`}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <UserCircle2 size={16} />
                      Profile Settings
                    </Link>

                    <Link
                      to="/home/user/settings"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <Settings size={16} />
                      Preferences
                    </Link>

                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 font-medium text-sm"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-gray-600 hover:text-gray-900 font-medium text-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Outside click to close dropdown */}
      {isProfileDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileDropdownOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
