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
    apiClient<Measurement[]>(`/clients/${clientId}/measurements`),

  getMeasurement: (measurementId: string): Promise<Measurement> =>
    apiClient<Measurement>(`/clients/measurements/${measurementId}`),

  createMeasurement: (
    clientId: string,
    data: CreateMeasurementRequest,
  ): Promise<Measurement> =>
    apiClient<Measurement>(`/clients/${clientId}/measurements`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateMeasurement: (
    id: string,
    data: UpdateMeasurementRequest,
  ): Promise<Measurement> =>
    apiClient<Measurement>(`/clients/measurements/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteMeasurement: (id: string): Promise<{ message: string }> =>
    apiClient<{ message: string }>(`/clients/measurements/${id}`, {
      method: "DELETE",
    }),
};
