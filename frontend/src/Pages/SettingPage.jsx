import React from "react";
import { Sun, Moon, Settings } from "lucide-react";

const SettingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <Settings className="w-8 h-8 text-gray-700" />
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <div className="space-y-12 max-w-3xl">
        {/* Theme Selection */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          <p className="text-sm text-gray-500 mb-6">Select your preferred theme.</p>
          <div className="flex gap-6">
            <button className="flex items-center gap-3 px-6 py-3 rounded-full border border-gray-300 bg-gray-100 text-gray-800 hover:bg-gray-200 transition">
              <Sun className="w-5 h-5" />
              Light Mode
            </button>
            <button className="flex items-center gap-3 px-6 py-3 rounded-full border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 transition">
              <Moon className="w-5 h-5" />
              Dark Mode
            </button>
          </div>
        </div>

        {/* Account Settings Placeholder */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <p className="text-sm text-gray-500">Additional settings will be available soon.</p>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
