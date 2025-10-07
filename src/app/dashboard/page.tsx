"use client";

import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useAuthContext } from "@/providers/auth-provider";

function DashboardContent() {
  const { admin } = useAuth();
  const { logout } = useAuthContext();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {admin?.businessName || "Admin"}
            </h1>
            <Button onClick={() => logout()} variant="outline">
              Logout
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900">Business Info</h3>
              <p className="text-gray-600 mt-2">Email: {admin?.email}</p>
              <p className="text-gray-600">Phone: {admin?.contactPhone}</p>
              <p className="text-gray-600">Address: {admin?.businessAddress}</p>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900">Account Status</h3>
              <p className="text-green-600 mt-2">
                {admin?.isEmailVerified
                  ? "Email Verified"
                  : "Pending Verification"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
