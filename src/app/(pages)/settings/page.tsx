"use client";

import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Lock,
  LogOut,
  Pencil,
  Shield,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/api/use-auth";
import { useAuthContext } from "@/lib/auth-provider";

export default function SettingsPage() {
  const router = useRouter();
  const { admin } = useAuth();
  const { logout } = useAuthContext();

  return (
    <div className="min-h-screen mb-16">
      {/* Header */}
      <div className="max-w-4xl mx-auto flex items-center px-4 md:px-6 py-4 md:py-5">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 group md:hidden"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700 group-hover:text-[#0F4C75] transition-colors" />
        </button>
        <h1 className="flex-1 text-xl md:text-2xl font-bold text-center md:text-left ml-3 md:ml-0 text-gray-900">
          Settings
        </h1>
        <div className="w-[50px] md:hidden"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Avatar */}
            <div className="flex justify-center md:justify-start">
              <div className="relative group">
                {/* Animated ring on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0F4C75] to-blue-600 rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500"></div>

                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 border-4 border-white shadow-lg ring-4 ring-gray-100 group-hover:ring-[#0F4C75]/20 transition-all duration-300">
                  <Image
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      admin?.businessName || "User",
                    )}&background=0F4C75&color=fff&size=200`}
                    alt={admin?.businessName || "User"}
                    width={112}
                    height={112}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {admin?.businessName || "User"}
              </h2>
              <p className="text-gray-600 mb-5 text-sm">{admin?.email}</p>
              <Button
                onClick={() => router.push("/settings/edit-profile")}
                className="bg-gradient-to-r from-[#0F4C75] to-[#0d3f5f] hover:from-[#0d3f5f] hover:to-[#0a2d45] text-white px-6 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm shadow-[#0F4C75]/30 hover:shadow-lg hover:shadow-[#0F4C75]/40 flex items-center gap-2 mx-auto md:mx-0"
              >
                <Pencil className="w-4 h-4" />
                <span className="font-semibold">Edit Profile</span>
              </Button>
            </div>
          </div>
        </div>

        {/* All Settings in One Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Security Section */}
          <div className="p-6 md:p-7 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              Security
            </h3>
            <button
              type="button"
              onClick={() => router.push("/settings/change-password")}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-all duration-200 group rounded-xl border border-transparent hover:border-[#0F4C75]/10"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#0F4C75]/10 flex items-center justify-center group-hover:bg-[#0F4C75]/20 transition-colors">
                  <Lock className="w-5 h-5 text-[#0F4C75]" />
                </div>
                <span className="text-gray-800 font-semibold text-base group-hover:text-[#0F4C75] transition-colors">
                  Change password
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#0F4C75] group-hover:translate-x-1 transition-all duration-200" />
            </button>
          </div>

          {/* About Section */}
          <div className="p-6 md:p-7 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              About
            </h3>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => router.push("/privacy-policy")}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-all duration-200 group rounded-xl border border-transparent hover:border-[#0F4C75]/10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0F4C75]/10 flex items-center justify-center group-hover:bg-[#0F4C75]/20 transition-colors">
                    <Shield className="w-5 h-5 text-[#0F4C75]" />
                  </div>
                  <span className="text-gray-800 font-semibold text-base group-hover:text-[#0F4C75] transition-colors">
                    Privacy Policy
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#0F4C75] group-hover:translate-x-1 transition-all duration-200" />
              </button>
              <button
                type="button"
                onClick={() => router.push("/terms-of-service")}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-all duration-200 group rounded-xl border border-transparent hover:border-[#0F4C75]/10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0F4C75]/10 flex items-center justify-center group-hover:bg-[#0F4C75]/20 transition-colors">
                    <FileText className="w-5 h-5 text-[#0F4C75]" />
                  </div>
                  <span className="text-gray-800 font-semibold text-base group-hover:text-[#0F4C75] transition-colors">
                    Terms of Service
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#0F4C75] group-hover:translate-x-1 transition-all duration-200" />
              </button>
            </div>
          </div>

          {/* Logout Button */}
          <div className="p-6 md:p-7">
            <button
              type="button"
              onClick={() => logout()}
              className="group w-full flex items-center justify-center gap-3 text-red-600 hover:text-white bg-red-50 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 border-2 border-red-200 hover:border-red-600 rounded-xl px-6 py-4 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md hover:shadow-red-500/30 font-semibold"
            >
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
