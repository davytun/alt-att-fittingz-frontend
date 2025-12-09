"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { use } from "react";
import { MeasurementsForm } from "@/components/client-profile/measurements-form";
import { Button } from "@/components/ui/button";
import { measurementsApi } from "@/lib/api/measurements";

export default function NewMeasurementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const { data: measurement } = useQuery({
    queryKey: ["measurement", editId],
    queryFn: () => measurementsApi.getMeasurement(editId!),
    enabled: !!editId,
  });

  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: (measurement: {
      name: string;
      measurements: Record<string, string>;
    }) =>
      editId
        ? measurementsApi.updateMeasurement(editId, {
            name: measurement.name,
            fields: measurement.measurements,
          })
        : measurementsApi.createMeasurement(id, {
            name: measurement.name,
            fields: measurement.measurements,
          }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["measurements", id] });
      queryClient.invalidateQueries({ queryKey: ["client", id] });
      if (editId) {
        queryClient.invalidateQueries({ queryKey: ["measurement", editId] });
        router.push(`/clients/${id}/measurements/${editId}`);
      } else {
        router.push(`/clients/${id}/measurements`);
      }
    },
  });

  const handleSave = (measurement: {
    name: string;
    measurements: Record<string, string>;
  }) => {
    saveMutation.mutate(measurement);
  };

  const handleCancel = () => {
    router.push(`/clients/${id}/measurements`);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      <div className="flex items-center gap-3 p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/clients/${id}/measurements`)}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-semibold text-[#222831]">
          {editId ? "Edit Measurement" : "New Measurement"}
        </h1>
      </div>

      <MeasurementsForm
        onSave={handleSave}
        onCancel={handleCancel}
        isLoading={saveMutation.isPending}
        initialData={measurement ? {
          name: measurement.name,
          measurements: measurement.fields as Record<string, string>,
        } : undefined}
      />
    </div>
  );
}
