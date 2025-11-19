import { apiClient } from "./client";

export interface Measurement {
  id: string;
  clientId: string;
  name: string;
  orderId?: string;
  fields: Record<string, unknown>;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  client?: {
    name: string;
  };
  order?: {
    orderNumber: string;
  };
}

export interface CreateMeasurementRequest {
  name: string;
  fields: Record<string, unknown>;
  orderId?: string;
  isDefault?: boolean;
}

export interface UpdateMeasurementRequest {
  name?: string;
  fields?: Record<string, unknown>;
  orderId?: string;
  isDefault?: boolean;
}

export const measurementsApi = {
  getMeasurements: (clientId: string): Promise<Measurement[]> =>
    apiClient.get<Measurement[]>(`/api/clients/${clientId}/measurements`),

  createMeasurement: (
    clientId: string,
    data: CreateMeasurementRequest,
  ): Promise<Measurement> =>
    apiClient.post<Measurement>(`/api/clients/${clientId}/measurements`, data),

  updateMeasurement: (
    id: string,
    data: UpdateMeasurementRequest,
  ): Promise<Measurement> =>
    apiClient.put<Measurement>(`/api/clients/measurements/${id}`, data),

  deleteMeasurement: (id: string): Promise<{ message: string }> =>
    apiClient.delete<{ message: string }>(`/api/clients/measurements/${id}`),
};
