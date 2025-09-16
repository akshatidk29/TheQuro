import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Camera, Edit3, Check, X, User, Mail, Calendar, Shield } from "lucide-react";
import { useAuthStore } from "../Stores/useAuthStore";
import { useProfileStore } from "../Stores/useProfileStore";
import NotFoundPage from "./NotFoundPage";

const ProfilePage = () => {
  const { authUser, checkAuth } = useAuthStore();
  const {
    loading,
    error,
    updateProfile,
    updateProfilePhoto,
    clearError,
  } = useProfileStore();

  const { userID } = useParams();
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);
  const [imageHover, setImageHover] = useState(false);

  useEffect(() => {
    if (authUser) {
      setName(authUser.fullName);
    }
  }, [authUser]);


  if (!authUser) return null;

  if (authUser._id !== userID) {
    return <NotFoundPage message="⚠️ Unauthorized Access to Profile" />;
  }

  const { email, profilePic, createdAt } = authUser;
  const joinedDate = new Date(createdAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await updateProfilePhoto(file);
    checkAuth();

  };

  const handleNameUpdate = async () => {
    if (!name.trim() || name === authUser.fullName) return;
    await updateProfile({ fullName: name });
    checkAuth();
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
              Profile Settings
            </h1>
            <p className="text-gray-600 text-lg">Manage your account information and preferences</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 -mt-6 pb-12">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 shadow-sm animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center mr-3">
                  <X className="w-3 h-3 text-white" />
                </div>
                <p className="text-red-800 font-medium">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800 transition-colors duration-200 font-medium"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-xl rounded-3xl overflow-hidden">
          {/* Card Header */}
          <div className="bg-gray-600 h-32 relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute -bottom-16 left-8">
              <div
                className="relative group"
                onMouseEnter={() => setImageHover(true)}
                onMouseLeave={() => setImageHover(false)}
              >
                <div className="w-32 h-32 rounded-full bg-white p-1 shadow-2xl transition-all duration-300 group-hover:scale-105">
                  <img
                    src={profilePic || "/avatar.png"}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>

                {/* Camera Overlay */}
                <div className={`absolute inset-0 bg-black/50 rounded-full flex items-center justify-center transition-all duration-300 ${imageHover ? 'opacity-100' : 'opacity-0'}`}>
                  <label className="cursor-pointer">
                    <Camera className="w-8 h-8 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Loading Indicator */}
                {loading && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium animate-pulse">
                      Uploading...
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="pt-20 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <User className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
                </div>

                {/* Full Name Field */}
                <div className="group">
                  <label className="flex items-center text-sm font-medium text-gray-600 mb-2">
                    Full Name
                  </label>

                  {editing ? (
                    <div className="flex items-center space-x-3 animate-in slide-in-from-left duration-300">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all duration-200 outline-none"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <button
                        onClick={handleNameUpdate}
                        disabled={loading}
                        className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditing(false);
                          setName(authUser.fullName);
                        }}
                        className="p-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-all duration-200 hover:scale-105"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 group-hover:border-blue-300 transition-all duration-200">
                      <span className="text-gray-800 font-medium text-lg">{authUser.fullName}</span>
                      <button
                        onClick={() => setEditing(true)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Email Field */}
                <div className="group">
                  <label className="flex items-center text-sm font-medium text-gray-600 mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200 group-hover:border-purple-300 transition-all duration-200">
                    <Mail className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-800 font-medium">{email}</span>
                    <div className="ml-auto">
                      <Shield className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed for security reasons</p>
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">Account Information</h3>
                </div>

                {/* Join Date */}
                <div className="group">
                  <label className="flex items-center text-sm font-medium text-gray-600 mb-2">
                    Member Since
                  </label>
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                    <span className="text-gray-800 font-medium text-lg">{joinedDate}</span>
                  </div>
                </div>

                {/* Account Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-600 rounded-xl p-4 text-white">
                    <div className="text-2xl font-bold">Active</div>
                    <div className="text-blue-100 text-sm">Account Status</div>
                  </div>
                  <div className="bg-green-600 rounded-xl p-4 text-white">
                    <div className="text-2xl font-bold">Verified</div>
                    <div className="text-purple-100 text-sm">Profile Status</div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8">
                  <h4 className="text-sm font-medium text-gray-600 mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <button className="w-full p-3 text-left bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors duration-200">
                          <Shield className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-700">Security Settings</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;