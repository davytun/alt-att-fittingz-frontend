"use client";

import { Add } from "iconsax-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export function DashboardEmptyState() {
  const router = useRouter();
  const { admin } = useAuth();

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#222831]">
          Hi, {admin?.businessName || "Admin"}
        </h1>
        <p className="text-gray-600 mt-2">
          Welcome. Here is an overview your fashion business dashboard. Get
          started by adding a client
        </p>
      </div>

      {/* Sections grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* Recent Clients Updates */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg">
              Recent Clients Updates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-gray-50 border border-gray-200 p-8 text-center text-gray-600 font-semibold">
              No Recent Clients Updates
            </div>
            <div className="flex justify-center">
              <Button
                onClick={() => router.push("/clients/new")}
                className="px-6"
              >
                <Add className="h-4 w-4 mr-2" />
                Add Your First Clients
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg">Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-gray-50 border border-gray-200 p-8 text-center text-gray-600 font-semibold">
              No Recent Order Updates
            </div>
            <div className="flex justify-center">
              <Button variant="secondary" className="px-6" disabled>
                Add Your First Order
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Inspirations */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg">Inspirations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-gray-50 border border-gray-200 p-8 text-center text-gray-600 font-semibold">
              No images uploaded in your gallery
            </div>
            <div className="flex justify-center">
              <Button variant="outline" className="px-6" disabled>
                Create a client profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
