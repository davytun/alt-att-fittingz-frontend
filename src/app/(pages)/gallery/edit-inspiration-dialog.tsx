"use client";

import { AlertTriangle, Loader2, Save, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
  useDeleteStyleImage,
  useUpdateStyleImage,
} from "@/hooks/api/use-styles";
import type { StyleImage } from "@/types/style";

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: clientsData } = useClientList(1, 100);
  const updateMutation = useUpdateStyleImage();
  const deleteMutation = useDeleteStyleImage();

  useEffect(() => {
    if (inspiration) {
      setClientId(inspiration.clientId || "");
      setCategory(inspiration.category || "");
      setDescription(inspiration.description || "");
      setShowDeleteConfirm(false);
    }
  }, [inspiration]);

  const handleUpdate = async () => {
    if (!inspiration || !inspiration.clientId) return;

    try {
      await updateMutation.mutateAsync({
        clientId: inspiration.clientId,
        imageId: inspiration.id,
        data: {
          category: category || undefined,
          description: description || undefined,
        },
      });
      toast.success("Inspiration updated successfully!");
      onOpenChange(false);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!inspiration || !inspiration.clientId) return;

    try {
      await deleteMutation.mutateAsync({
        clientId: inspiration.clientId,
        imageId: inspiration.id,
      });
      toast.success("Inspiration deleted successfully!");
      onOpenChange(false);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete. Please try again.");
    }
  };

  const getClientName = () => {
    if (!clientId) return "Admin Library";
    const client = clientsData?.data?.find((c) => c.id === clientId);
    return client ? client.name : "Unknown Client";
  };

  if (!inspiration) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-7xl max-h-[95vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="border-b border-gray-200 p-6 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="space-y-2">
            <DialogTitle className="text-center text-2xl font-bold text-gray-900">
              Edit Inspiration
            </DialogTitle>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {getClientName()}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Image Preview - Left Side */}
            <div className="space-y-4">
              <div className="relative w-full aspect-[3/4] min-h-[400px] flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-lg group">
                <Image
                  src={inspiration.imageUrl}
                  alt={inspiration.description || "Inspiration"}
                  fill
                  className="object-contain"
                />

                {/* Image Overlay Info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <p className="text-sm font-medium mb-1">Original Upload</p>
                    {inspiration.category && (
                      <p className="text-xs text-white/80">
                        Category: {inspiration.category}
                      </p>
                    )}
                  </div>
                </div>

                {/* Replace Image Overlay Button */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <Button
                    variant="secondary"
                    className="gap-2 shadow-lg"
                    onClick={() =>
                      toast.info(
                        "Image replacement coming soon! For now, delete and upload a new one.",
                      )
                    }
                  >
                    <Upload className="h-4 w-4" /> Replace Image
                  </Button>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Image replacement is coming soon. To
                  change the image, delete this inspiration and upload a new
                  one.
                </p>
              </div>
            </div>

            {/* Form Fields - Right Side */}
            <div className="space-y-6 flex flex-col">
              <div className="space-y-5 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-1 w-1 rounded-full bg-[#0F4C75]" />
                  <h3 className="font-semibold text-lg text-gray-900">
                    Update Details
                  </h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-client" className="text-sm font-medium">
                    Client Name
                  </Label>
                  <Select value={clientId} onValueChange={setClientId} disabled>
                    <SelectTrigger
                      id="edit-client"
                      className="h-12 bg-gray-50 border-gray-300 cursor-not-allowed"
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
                  <p className="text-xs text-gray-500">
                    Client cannot be changed after upload
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="edit-category"
                    className="text-sm font-medium"
                  >
                    Category / Tags
                  </Label>
                  <Input
                    id="edit-category"
                    placeholder="e.g. Wedding Gown, Evening Wear"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-12 bg-white border-gray-300 focus-visible:ring-2 focus-visible:ring-[#0F4C75] focus-visible:border-[#0F4C75] transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="edit-description"
                    className="text-sm font-medium"
                  >
                    Additional Information
                  </Label>
                  <Textarea
                    id="edit-description"
                    placeholder="Add notes, requirements, or preferences..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-white min-h-[160px] border-gray-300 focus-visible:ring-2 focus-visible:ring-[#0F4C75] focus-visible:border-[#0F4C75] transition-all resize-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-gray-200 space-y-3">
                {!showDeleteConfirm ? (
                  <>
                    <Button
                      onClick={handleUpdate}
                      disabled={updateMutation.isPending}
                      className="w-full h-12 bg-gradient-to-r from-[#0F4C75] to-[#1a5a8f] hover:from-[#0F4C75]/90 hover:to-[#1a5a8f]/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {updateMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-5 w-5" />
                          Save Changes
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={deleteMutation.isPending}
                      className="w-full h-12 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 font-medium transition-all"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Inspiration
                    </Button>
                  </>
                ) : (
                  <div className="rounded-xl border-2 border-red-300 bg-gradient-to-br from-red-50 to-orange-50 p-6 space-y-4 shadow-lg">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-red-100 p-2">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-red-900 mb-1">
                          Confirm Deletion
                        </h4>
                        <p className="text-sm text-red-800">
                          Are you sure you want to delete this inspiration? This
                          action cannot be undone and the image will be
                          permanently removed.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 h-11 bg-white border-gray-300 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        className="flex-1 h-11 bg-red-600 hover:bg-red-700 shadow-md"
                      >
                        {deleteMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Yes, Delete
                          </>
                        )}
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
