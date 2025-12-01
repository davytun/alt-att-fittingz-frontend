"use client";

import { Edit, Plus, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { stylesApi } from "@/lib/api/styles";
import type { StyleImage } from "@/types/style";

interface StyleInspirationsCardProps {
  clientId: string;
}

export function StyleInspirationsCard({
  clientId,
}: StyleInspirationsCardProps) {
  const queryClient = useQueryClient();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageToDelete, setImageToDelete] = useState<StyleImage | null>(null);

  // Fetch style images
  const { data, isLoading } = useQuery({
    queryKey: ["styleImages", clientId],
    queryFn: () => stylesApi.getClientImages(clientId, 1, 20),
  });

  const styleImages = data?.data || [];

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: (files: File[]) =>
      stylesApi.uploadClientImages(clientId, {
        images: files,
        category: category || undefined,
        description: description || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["styleImages", clientId] });
      toast.success("Images uploaded successfully!");
      setIsUploadOpen(false);
      setSelectedImages([]);
      setCategory("");
      setDescription("");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upload images");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (imageId: string) =>
      stylesApi.deleteStyleImage(clientId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["styleImages", clientId] });
      toast.success("Image deleted successfully!");
      setImageToDelete(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete image");
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      // Validate file sizes (max 5MB per file)
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB
      const oversizedFiles = filesArray.filter((file) => file.size > MAX_SIZE);

      if (oversizedFiles.length > 0) {
        toast.error(`Some files are too large. Max size is 5MB per file.`);
        return;
      }

      setSelectedImages((prev) => [...prev, ...filesArray]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedImages.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    console.log("Starting upload of", selectedImages.length, "images");
    console.log(
      "Total size:",
      selectedImages.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024,
      "MB"
    );

    try {
      await uploadMutation.mutateAsync(selectedImages);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const handleDelete = () => {
    if (imageToDelete) {
      deleteMutation.mutate(imageToDelete.id);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-[#F7F9FC]">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Style Inspirations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-3/4 bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-[#F7F9FC]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Style Inspirations
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsUploadOpen(true)}
          >
            <Plus className="h-4 w-4 text-[#0F4C75]" />
          </Button>
        </CardHeader>
        <CardContent>
          {styleImages.length === 0 ? (
            <div
              onClick={() => setIsUploadOpen(true)}
              className="aspect-3/4 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center space-y-2 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all"
            >
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="text-sm text-gray-500">Upload Style Images</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-3">
              {(() => {
                console.log("Style Images:", styleImages);
                return styleImages.map((image) => (
                  <div
                    key={image.id}
                    className="group relative aspect-3/4 bg-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <img
                      src={image.imageUrl}
                      alt={image.description || "Style inspiration"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Failed to load image:", image.imageUrl);
                        e.currentTarget.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='12' fill='%23999'%3EImage Error%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <button
                      onClick={() => setImageToDelete(image)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                    {image.category && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2">
                        {image.category}
                      </div>
                    )}
                  </div>
                ));
              })()}
              <div
                onClick={() => setIsUploadOpen(true)}
                className="aspect-3/4 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center space-y-2 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all"
              >
                <Upload className="h-6 w-6 text-gray-400" />
                <span className="text-sm text-gray-500">Add More</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Style Images</DialogTitle>
            <DialogDescription>
              Select images to add to the client's style inspirations
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="images">Images</Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
              />
            </div>

            {selectedImages.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Images ({selectedImages.length})</Label>
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  {selectedImages.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-20 object-cover rounded"
                      />
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="category">Category (Optional)</Label>
              <Input
                id="category"
                placeholder="e.g., Formal, Casual, Traditional"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Add a description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUploadOpen(false)}
              disabled={uploadMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploadMutation.isPending || selectedImages.length === 0}
              className="bg-[#0F4C75] hover:bg-[#0F4C75]/90"
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={imageToDelete !== null}
        onOpenChange={() => setImageToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Style Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setImageToDelete(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
