import { useQuery } from "@tanstack/react-query";
import { measurementsApi } from "@/lib/api/measurements";

export const useMeasurement = (measurementId: string) => {
  return useQuery({
    queryKey: ["measurement", measurementId],
    queryFn: () => measurementsApi.getMeasurement(measurementId),
    enabled: !!measurementId,
  });
};
