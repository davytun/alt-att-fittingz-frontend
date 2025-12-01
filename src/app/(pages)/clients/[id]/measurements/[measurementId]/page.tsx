"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { measurementsApi } from "@/lib/api/measurements";

export default function MeasurementDetailPage({
  params,
}: {
  params: Promise<{ id: string; measurementId: string }>;
}) {
  const { id: clientId, measurementId } = use(params);
  const router = useRouter();

  // Fetch measurement data
  const { data: measurements, isLoading } = useQuery({
    queryKey: ["measurements", clientId],
    queryFn: () => measurementsApi.getMeasurements(clientId),
  });

  const measurement = measurements?.find((m) => m.id === measurementId);

  if (isLoading || !measurement) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2F2F2]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  const fields = measurement.fields as Record<string, unknown>;
  const fieldEntries = Object.entries(fields);

  // Helper to format field names (camelCase to Title Case)
  const formatFieldName = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] py-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 mb-8">
        <Link
          href={`/clients/${clientId}`}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Client Profile
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {measurement.name}
              {measurement.isDefault && (
                <span className="ml-3 text-sm font-normal text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  Default
                </span>
              )}
            </h1>
            <p className="text-gray-600 mt-1">
              Last updated:{" "}
              {new Date(measurement.updatedAt).toLocaleDateString()}
            </p>
          </div>
          <Button
            onClick={() =>
              router.push(
                `/clients/${clientId}/measurements?edit=${measurementId}`
              )
            }
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Measurement Details */}
      <div className="max-w-4xl mx-auto px-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Measurement Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {fieldEntries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No measurement data available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fieldEntries.map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      {formatFieldName(key)}
                    </Label>
                    <Input
                      value={String(value || "")}
                      disabled
                      className="bg-gray-50 border-gray-200"
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Associated Order Info */}
        {measurement.order && (
          <Card className="bg-white mt-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Associated Order
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={`/clients/${clientId}/orders/${measurement.orderId}`}
                className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {measurement.order.orderNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    Click to view order details
                  </p>
                </div>
                <ArrowLeft className="h-5 w-5 text-blue-600 rotate-180" />
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Client Info */}
        {measurement.client && (
          <Card className="bg-white mt-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    {measurement.client.name}
                  </p>
                  <p className="text-sm text-gray-600">Client Name</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
