"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, Loader2, Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProfile, useUpdateProfile } from "@/hooks/api/use-profile";
import {
  type UpdateProfileFormData,
  updateProfileSchema,
} from "@/lib/auth-schemas";

export function ProfileForm() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    values: {
      businessName: profile?.businessName || "",
      contactPhone: profile?.contactPhone || "",
      businessAddress: profile?.businessAddress || "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: UpdateProfileFormData) => {
    const changes: Partial<UpdateProfileFormData> & { profileImage?: File } =
      {};

    if (data.businessName !== profile?.businessName) {
      changes.businessName = data.businessName;
    }
    if (data.contactPhone !== profile?.contactPhone) {
      changes.contactPhone = data.contactPhone;
    }
    if (data.businessAddress !== profile?.businessAddress) {
      changes.businessAddress = data.businessAddress;
    }
    if (selectedImage) {
      changes.profileImage = selectedImage;
    }

    if (Object.keys(changes).length > 0) {
      updateProfile.mutate(changes);
    }
  };

  const handleCancel = () => {
    form.reset();
    setSelectedImage(null);
    setImagePreview(null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#0F4C75]/20 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-[#0F4C75] border-t-transparent rounded-full animate-spin absolute top-0"></div>
        </div>
        <p className="mt-4 text-sm text-gray-600 font-medium">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <div className="max-w-6xl mx-auto flex items-center px-4 py-5">
        <button
          onClick={() => window.history.back()}
          className="p-2.5 hover:bg-gray-100/80 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 group"
          type="button"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-[#0F4C75] transition-colors" />
        </button>
        <h1 className="flex-1 text-xl font-bold text-center">Edit Profile</h1>
        <div className="w-[50px]"></div>{" "}
        {/* Spacer to balance the back button */}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Profile Image Card */}
          <div>
            <div className="flex justify-center">
              <div className="relative group">
                {/* Animated ring on hover */}
                <div className="absolute inset-0 bg-linear-to-r from-[#0F4C75] to-blue-600 rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500"></div>

                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-linear-to-br from-gray-200 to-gray-300 border-4 border-white shadow-xl ring-4 ring-gray-100 group-hover:ring-[#0F4C75]/20 transition-all duration-300">
                  <img
                    src={
                      imagePreview ||
                      profile?.profileImageUrl ||
                      "/placeholder-avatar.png"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          profile?.businessName || "User",
                        )}&background=0F4C75&color=fff&size=200`;
                    }}
                  />
                </div>

                <label
                  htmlFor="profileImage"
                  className="absolute bottom-0 right-0 w-11 h-11 bg-gradient-to-br from-[#0F4C75] to-[#0d3f5f] rounded-full flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 transition-all duration-200 border-4 border-white group-hover:shadow-2xl"
                >
                  <Pencil className="w-5 h-5 text-white" />
                </label>
                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {selectedImage && (
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-green-600 animate-in fade-in slide-in-from-top-2 duration-300">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-medium">New image selected</span>
              </div>
            )}
          </div>

          {/* Form Fields Card */}
          <div className="bg-white rounded-2xl shadow-lg shadow-blue-100/50 p-12 border border-gray-100/50 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Email Address */}
              <div className="space-y-3">
                <label
                  htmlFor="email"
                  className="block text-base font-semibold text-gray-700"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={profile?.email || ""}
                  disabled
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 text-base placeholder:text-gray-400 cursor-not-allowed"
                />
              </div>

              {/* Contact Phone */}
              <div className="space-y-3">
                <label
                  htmlFor="contactPhone"
                  className="block text-base font-semibold text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  id="contactPhone"
                  type="tel"
                  placeholder="Enter your phone number"
                  {...form.register("contactPhone")}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl bg-white text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F4C75]/50 focus:border-[#0F4C75] transition-all duration-200 hover:border-gray-300"
                />
                {form.formState.errors.contactPhone && (
                  <p className="text-sm text-red-600 mt-2 flex items-center gap-1.5 animate-in slide-in-from-top-1">
                    <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                    {form.formState.errors.contactPhone.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Business Name */}
              <div className="space-y-3">
                <label
                  htmlFor="businessName"
                  className="block text-base font-semibold text-gray-700"
                >
                  Business Name
                </label>
                <input
                  id="businessName"
                  type="text"
                  placeholder="Enter your business name"
                  {...form.register("businessName")}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl bg-white text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F4C75]/50 focus:border-[#0F4C75] transition-all duration-200 hover:border-gray-300"
                />
                {form.formState.errors.businessName && (
                  <p className="text-sm text-red-600 mt-2 flex items-center gap-1.5 animate-in slide-in-from-top-1">
                    <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                    {form.formState.errors.businessName.message}
                  </p>
                )}
              </div>

              {/* Business Address */}
              <div className="space-y-3">
                <label
                  htmlFor="businessAddress"
                  className="block text-base font-semibold text-gray-700"
                >
                  Business Address
                </label>
                <input
                  id="businessAddress"
                  type="text"
                  placeholder="Enter your business address"
                  {...form.register("businessAddress")}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl bg-white text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F4C75]/50 focus:border-[#0F4C75] transition-all duration-200 hover:border-gray-300"
                />
                {form.formState.errors.businessAddress && (
                  <p className="text-sm text-red-600 mt-2 flex items-center gap-1.5 animate-in slide-in-from-top-1">
                    <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                    {form.formState.errors.businessAddress.message}
                  </p>
                )}
              </div>
            </div>{" "}
            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="submit"
                disabled={updateProfile.isPending}
                className="w-full bg-gradient-to-r from-[#0F4C75] to-[#0d3f5f] hover:from-[#0d3f5f] hover:to-[#0a2d45] text-white font-semibold py-5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#0F4C75]/30 hover:shadow-xl hover:shadow-[#0F4C75]/40 hover:scale-[1.02] active:scale-[0.98] text-base"
              >
                {updateProfile.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Save Profile</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="w-full bg-white hover:bg-red-50 text-red-600 font-semibold py-5 rounded-xl border-2 border-red-500 hover:border-red-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
