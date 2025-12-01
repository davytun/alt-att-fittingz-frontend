"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { MeasurementsForm } from "@/components/client-profile/measurements-form";
import { Button } from "@/components/ui/button";
import { measurementsApi } from "@/lib/api/measurements";

export default function MeasurementsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: (measurement: {
      name: string;
      measurements: Record<string, string>;
    }) =>
      measurementsApi.createMeasurement(id, {
        name: measurement.name,
        fields: measurement.measurements,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["measurements", id] });
      queryClient.invalidateQueries({ queryKey: ["client", id] });
      router.back();
    },
  });

  const handleSave = (measurement: {
    name: string;
    measurements: Record<string, string>;
  }) => {
    saveMutation.mutate(measurement);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-semibold text-[#222831]">Measurement</h1>
      </div>
      <div className="flex items-center justify-between p-4 border-b"></div>

      <MeasurementsForm
        onSave={handleSave}
        onCancel={handleCancel}
        isLoading={saveMutation.isPending}
      />
    </div>
  );
}
