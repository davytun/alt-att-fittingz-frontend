"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Eye, EyeOff, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  const handleUpdatePassword = () => {
    // Add password update logic here
    console.log("Updating password...");
    router.back();
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="max-w-2xl mx-auto flex items-center px-4 md:px-6 py-4 md:py-5">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 group"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-[#0F4C75] transition-colors" />
        </button>
        <h1 className="flex-1 text-xl md:text-2xl font-bold text-center text-gray-900 -ml-[50px]">
          Change Password
        </h1>
      </div>

      {/* Form Container */}
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10">
          {/* Icon Header */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#0F4C75]/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-[#0F4C75]" />
            </div>
          </div>

          <p className="text-center text-gray-600 mb-8">
            Enter your current password and choose a new one
          </p>

          <div className="space-y-6">
            {/* Current Password */}
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Current Password
              </label>
              <div className="relative">
                <input
                  id="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter your current password"
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl bg-white text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F4C75]/50 focus:border-[#0F4C75] transition-all duration-200 hover:border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-[#0F4C75] hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  {showPasswords.current ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter your new password"
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl bg-white text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F4C75]/50 focus:border-[#0F4C75] transition-all duration-200 hover:border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-[#0F4C75] hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  {showPasswords.new ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your new password"
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl bg-white text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F4C75]/50 focus:border-[#0F4C75] transition-all duration-200 hover:border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-[#0F4C75] hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                Password must contain:
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#0F4C75] rounded-full"></span>
                  At least 8 characters
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#0F4C75] rounded-full"></span>
                  One uppercase and one lowercase letter
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#0F4C75] rounded-full"></span>
                  One number and one special character
                </li>
              </ul>
            </div>

            {/* Update Button */}
            <div className="pt-4">
              <button
                onClick={handleUpdatePassword}
                className="w-full bg-gradient-to-r from-[#0F4C75] to-[#0d3f5f] hover:from-[#0d3f5f] hover:to-[#0a2d45] text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#0F4C75]/30 hover:shadow-xl hover:shadow-[#0F4C75]/40"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
