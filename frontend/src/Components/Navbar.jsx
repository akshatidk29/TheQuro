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
  HelpCircle
} from "lucide-react";

import { useAuthStore } from "../Stores/useAuthStore";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser, checkAuth, logout, isCheckingAuth } = useAuthStore();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      await checkAuth();
    };
    fetchData();
  }, [authUser]);



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
    <nav className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50 px-4 sm:px-6 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          to="/home"
          className="flex items-center space-x-2 text-2xl font-bold hover:scale-105 transition-transform"
        >
          <span>TheQuro</span>
        </Link>

        {authUser && (
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${isActive(item.path)
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                >
                  <Icon size={18} />
                  <span className="text-sm">{item.name}</span>
                </Link>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-3">
          {authUser ? (
            <>{!isCheckingAuth && authUser ? (
              <Link
                to="/home/user/transactions"
                className="flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold hover:bg-blue-200 transition-colors"
              >
                <TrendingUp size={14} className="mr-1" />
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

              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    <img
                      src={authUser.profilePic || "/avatar.png"}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {authUser.fullName?.split(" ")[0]}
                  </span>
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{authUser.fullName}</p>
                      <p className="text-xs text-gray-500">{authUser.email}</p>
                    </div>

                    <Link
                      to={`/home/user/profile/${authUser?._id}`}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <UserCircle2 size={16} />
                      Profile Settings
                    </Link>

                    <Link
                      to="/home/user/settings"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <Settings size={16} />
                      Preferences
                    </Link>

                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
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
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

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
