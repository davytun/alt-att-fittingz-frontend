import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { measurementsApi } from "@/lib/api/measurements";

interface MeasurementsCardProps {
  clientId: string;
}

export function MeasurementsCard({ clientId }: MeasurementsCardProps) {
  const router = useRouter();
  const { data: measurements = [], isLoading } = useQuery({
    queryKey: ["measurements", clientId],
    queryFn: () => measurementsApi.getMeasurements(clientId),
  });

  const handleAddMeasurement = () => {
    router.push(`/clients/${clientId}/measurements/new`);
  };

  const handleViewAll = () => {
    router.push(`/clients/${clientId}/measurements`);
  };

  const handleViewMeasurement = (measurementId: string) => {
    router.push(`/clients/${clientId}/measurements/${measurementId}`);
  };

  return (
    <Card className="bg-[#F7F9FC]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Measurements</CardTitle>
        <Button
          variant="link"
          className="text-[#0F4C75] font-bold p-0 hover:text-[#0F4C75]/90 transition-all duration-300 ease-in-out cursor-pointer"
          onClick={handleViewAll}
        >
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="p-4 bg-white rounded-lg">
            <p className="text-sm text-[#A1A1A1]">Loading measurements...</p>
          </div>
        ) : measurements.length > 0 ? (
          <div className="space-y-3">
            {(() => {
              const defaultMeasurement = measurements.find((m) => m.isDefault);
              const latestMeasurements = measurements
                .filter((m) => !m.isDefault)
                .sort(
                  (a, b) =>
                    new Date(b.updatedAt).getTime() -
                    new Date(a.updatedAt).getTime(),
                )
                .slice(0, 2);

              const displayMeasurements = defaultMeasurement
                ? [defaultMeasurement, ...latestMeasurements]
                : latestMeasurements;

              return displayMeasurements.map((measurement) => (
                <div
                  key={measurement.id}
                  onClick={() => handleViewMeasurement(measurement.id)}
                  className="p-4 bg-white rounded-lg flex items-center border justify-between cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div>
                    <h4 className="font-medium text-[#222831]">
                      {measurement.isDefault
                        ? `${measurement.name} (Default)`
                        : measurement.name || "Untitled Measurement"}
                    </h4>
                    <p className="text-sm text-[#A1A1A1]">
                      Last updated{" "}
                      {new Date(measurement.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-[#222831]" />
                </div>
              ));
            })()}
          </div>
        ) : (
          <div className="p-4 bg-white rounded-lg">
            <p className="text-sm text-[#A1A1A1]">No measurements yet</p>
          </div>
        )}
        <div className="flex justify-center">
          <Button
            size="sm"
            onClick={handleAddMeasurement}
            className="bg-white w-full py-5 border-[#0F4C75] border-2 hover:bg-[#0F4C75]/90 text-[#0F4C75] hover:text-white transition-all duration-300 ease-in-out"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Measurement
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
