export interface StyleImage {
  id: string;
  imageUrl: string;
  publicId: string;
  category?: string;
  description?: string;
  clientId?: string;
  adminId: string;
  createdAt: string;
}

export interface StyleImagesResponse {
  data: StyleImage[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface UploadStyleImagesRequest {
  images: File[];
  category?: string;
  description?: string;
}

export interface UpdateStyleImageRequest {
  category?: string;
  description?: string;
}

export interface DeleteMultipleImagesRequest {
  imageIds: string[];
}

export interface DeleteMultipleImagesResponse {
  message: string;
  deletedCount: number;
  failedCount: number;
  failedImages: {
    id: string;
    reason: string;
  }[];
}

export interface StyleImageCountResponse {
  count: number;
}