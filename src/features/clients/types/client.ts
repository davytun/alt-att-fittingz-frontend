export interface Measurement {
  id: string;
  fields: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface StyleImage {
  id: string;
  imageUrl: string;
  publicId: string;
  category: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  eventType: string;
  favoriteColors: string[];
  dislikedColors: string[];
  preferredStyles: string[];
  bodyShape: string;
  additionalDetails: string;
  adminId: string;
  createdAt: string;
  updatedAt: string;
  measurements: Measurement[];
  styleImages: StyleImage[];
  _count: {
    measurements: number;
    styleImages: number;
  };
}

export interface CreateClientRequest {
  name: string;
  phone: string;
  email: string;
  eventType: string;
  favoriteColors: string[];
  dislikedColors: string[];
  preferredStyles: string[];
  bodyShape?: string;
  additionalDetails?: string;
}

export interface UpdateClientRequest extends Partial<CreateClientRequest> {}

export interface ClientsResponse {
  data: Client[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ClientResponse {
  data: Client;
}

export interface DeleteClientResponse {
  message: string;
}

export interface ApiError {
  message: string;
  errors?: Array<{
    msg: string;
    param: string;
    location: string;
    value: string;
  }>;
  errorType?: string;
}

export type ClientError = ApiError & { status?: number };
