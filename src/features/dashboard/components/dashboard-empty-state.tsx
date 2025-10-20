"use client";

import { User } from "iconsax-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/use-auth";

export function DashboardEmptyState() {
  const router = useRouter();
  const { admin } = useAuth();

  // Extract first name from business name or email
  const getFirstName = () => {
    if (!admin) return "";

    // Try to get first name from business name
    if (admin.businessName) {
      return admin.businessName.split(" ")[0];
    }

    // Fallback to email username
    if (admin.email) {
      return admin.email.split("@")[0];
    }

    return "";
  };

  const firstName = getFirstName();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl border-0 shadow-none bg-transparent">
        <CardContent className="p-8 text-center">
          {/* Welcome Message */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Hi {firstName || "there"}! Welcome to your fashion business
              dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Get started by adding a client.
            </p>
          </div>

          {/* No Clients Card */}
          <Card className="bg-blue-50 border-blue-200 mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                {/* Person Icon */}
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-blue-200">
                  <User className="h-8 w-8 text-blue-600" variant="Bulk" />
                </div>

                {/* No Clients Text */}
                <div className="text-center">
                  <p className="text-gray-900 font-medium">No clients yet</p>
                  <p className="text-gray-600 text-sm mt-1">
                    Add your first clients to start managing their styles
                    preferences
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Client Button */}
          <Button
            onClick={() => router.push("/clients/new")}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 h-auto text-base font-medium"
          >
            Add your first client
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
