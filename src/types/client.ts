export type {
  Client,
  ClientResponse,
  ClientsResponse,
  CreateClientFormData,
  DeleteClientResponse,
  Measurement,
  StyleImage,
  UpdateClientFormData,
} from "@/lib/client-schemas";

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
