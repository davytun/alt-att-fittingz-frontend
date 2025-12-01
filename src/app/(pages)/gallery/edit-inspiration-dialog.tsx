"use client";

import { useState, useEffect } from "react";
import { Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useClientList } from "@/hooks/api/use-clients";
import {
  useUpdateStyleImage,
  useDeleteStyleImage,
} from "@/hooks/api/use-styles";
import type { StyleImage } from "@/types/style";
import { toast } from "sonner";

interface EditInspirationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inspiration: StyleImage | null;
}

export function EditInspirationDialog({
  open,
  onOpenChange,
  inspiration,
}: EditInspirationDialogProps) {
  const [clientId, setClientId] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  // Note: Replacing the image is not supported by the current API update endpoint,
  // so we'll just show the current image. The design shows "Replace Image" but
  // without backend support we might need to skip or implement as delete+upload.
  // For now, I will implement the UI but maybe disable the functionality or just show the image.

  const { data: clientsData } = useClientList(1, 100);
  const updateMutation = useUpdateStyleImage();
  const deleteMutation = useDeleteStyleImage();

  useEffect(() => {
    if (inspiration) {
      setClientId(inspiration.clientId || "");
      setCategory(inspiration.category || "");
      setDescription(inspiration.description || "");
    }
  }, [inspiration]);

  const handleUpdate = async () => {
    if (!inspiration || !inspiration.clientId) return;

    try {
      await updateMutation.mutateAsync({
        clientId: inspiration.clientId, // Original client ID needed for the hook? Or new one?
        // The hook signature is: ({ clientId, imageId, data }) => ...
        // If we change the client, this might be tricky as the ID is associated with the client.
        // Assuming we can't move images between clients easily with the current API structure
        // (it's nested under client).
        // For now, let's assume we are updating metadata for the SAME client.
        // If the user changes the client in the dropdown, that would technically require moving the image.
        // Let's see if the API supports it. The `UpdateStyleImageRequest` likely just takes metadata.

        imageId: inspiration.id,
        data: {
          category: category || undefined,
          description: description || undefined,
        },
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    if (!inspiration || !inspiration.clientId) return;

    try {
      await deleteMutation.mutateAsync({
        clientId: inspiration.clientId,
        imageId: inspiration.id,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  if (!inspiration) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-center text-xl font-bold text-gray-900">
            Edit Inspiration
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 pt-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            {/* Image Preview - Left Side */}
            <div className="relative w-full h-full min-h-[400px] flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={inspiration.imageUrl}
                alt={inspiration.description || "Inspiration"}
                className="max-h-full max-w-full object-contain"
              />
              {/* "Replace Image" button overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  className="gap-2"
                  onClick={() =>
                    toast.info("Image replacement not supported yet")
                  }
                >
                  <Upload className="h-4 w-4" /> Replace Image
                </Button>
              </div>
            </div>

            {/* Form Fields - Right Side */}
            <div className="space-y-6 flex flex-col h-full">
              <div className="space-y-4 flex-1">
                <div className="space-y-2">
                  <Label htmlFor="edit-client">Client Name</Label>
                  <Select value={clientId} onValueChange={setClientId} disabled>
                    <SelectTrigger
                      id="edit-client"
                      className="h-12 bg-white border-[#0F4C75] focus:ring-[#0F4C75]"
                    >
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientsData?.data?.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-category">Style Tag</Label>
                  <Input
                    id="edit-category"
                    placeholder="Wedding Gown"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-12 bg-white border-[#0F4C75] focus-visible:ring-[#0F4C75]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-description">
                    Additional Information
                  </Label>
                  <Textarea
                    id="edit-description"
                    placeholder="Description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-white min-h-[150px] border-[#0F4C75] focus-visible:ring-[#0F4C75]"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                {!showDeleteConfirm ? (
                  <>
                    <Button
                      onClick={handleUpdate}
                      disabled={updateMutation.isPending}
                      className="w-full h-12 bg-[#0F4C75] hover:bg-[#0F4C75]/90 text-white"
                    >
                      {updateMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={deleteMutation.isPending}
                      className="w-full h-12 bg-red-500 hover:bg-red-600"
                    >
                      {deleteMutation.isPending
                        ? "Deleting..."
                        : "Delete Inspiration"}
                    </Button>
                  </>
                ) : (
                  <div className="w-full space-y-3 p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="text-center text-sm text-red-800 font-medium">
                      Are you sure? This action cannot be undone.
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 h-10 bg-white"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        className="flex-1 h-10 bg-red-500 hover:bg-red-600"
                      >
                        {deleteMutation.isPending
                          ? "Deleting..."
                          : "Yes, Delete"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
