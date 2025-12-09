"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";

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
  const { data: measurement, isLoading } = useQuery({
    queryKey: ["measurement", measurementId],
    queryFn: () => measurementsApi.getMeasurement(measurementId),
  });

  if (isLoading || !measurement) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2F2F2]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  const fields = measurement.fields as Record<string, unknown>;
  const fieldEntries = Object.entries(fields);

  // Helper to format field names
  const formatFieldName = (key: string) => {
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
      .replace(/\s+/g, ' ');
  };

  // Helper to format values with units
  const formatValue = (value: unknown) => {
    const strValue = String(value || '');
    // If it's a number, assume it's in cm
    if (!isNaN(Number(strValue)) && strValue.trim() !== '') {
      return `${strValue} cm`;
    }
    return strValue;
  };

  // Capitalize name
  const capitalizedName = measurement.name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      {/* Header */}
      <section className="relative overflow-hidden rounded-b-[3rem] bg-[#0F4C75] px-6 py-12 text-white shadow-sm md:px-12">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-white/80 mb-2">
                Measurement Details
              </p>
              <h1 className="text-2xl font-bold md:text-3xl">
                {capitalizedName}
                {measurement.isDefault && (
                  <span className="ml-3 text-sm font-normal text-blue-200 bg-blue-900/30 px-2 py-1 rounded">
                    Default
                  </span>
                )}
              </h1>
              <p className="text-white/80 mt-2 text-sm">
                {measurement.order?.orderNumber && (
                  <span className="font-mono bg-white/10 px-2 py-1 rounded mr-2">
                    {measurement.order.orderNumber}
                  </span>
                )}
                Last updated: {new Date(measurement.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <Button
              onClick={() =>
                router.push(
                  `/clients/${clientId}/measurements/new?edit=${measurementId}`,
                )
              }
              className="bg-white text-[#0F4C75] hover:bg-white/90"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-16 -bottom-20 h-56 w-56 rounded-full bg-white/10 md:-right-6 md:-bottom-16" />
      </section>

      {/* Measurement Details */}
      <div className="container mx-auto px-4 py-8">
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
                {fieldEntries.map(([key, value]) => {
                  const strValue = String(value || '');
                  const numValue = !isNaN(Number(strValue)) && strValue.trim() !== '' ? strValue : null;
                  
                  return (
                    <div key={key} className="space-y-1">
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {formatFieldName(key)}
                      </Label>
                      <p className="text-lg font-semibold text-gray-900">
                        {numValue ? (
                          <>
                            {numValue} <span className="text-sm font-normal text-gray-500">cm</span>
                          </>
                        ) : (
                          strValue
                        )}
                      </p>
                    </div>
                  );
                })}
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
