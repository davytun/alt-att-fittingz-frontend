"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  useUploadClientImages,
  useUploadAdminImages,
} from "@/hooks/api/use-styles";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AddInspirationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddInspirationDialog({
  open,
  onOpenChange,
}: AddInspirationDialogProps) {
  const [uploadMode, setUploadMode] = useState<"client" | "admin">("client");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [clientId, setClientId] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const { data: clientsData } = useClientList(1, 100);
  const clientUploadMutation = useUploadClientImages();
  const adminUploadMutation = useUploadAdminImages();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB
      const oversizedFiles = filesArray.filter((file) => file.size > MAX_SIZE);

      if (oversizedFiles.length > 0) {
        toast.error("Some files are too large. Max size is 5MB per file.");
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
    if (uploadMode === "client" && !clientId) {
      toast.error("Please select a client");
      return;
    }

    try {
      if (uploadMode === "admin") {
        await adminUploadMutation.mutateAsync({
          images: selectedImages,
          category: category || undefined,
          description: description || undefined,
        });
      } else {
        await clientUploadMutation.mutateAsync({
          clientId,
          data: {
            images: selectedImages,
            category: category || undefined,
            description: description || undefined,
          },
        });
      }
      onOpenChange(false);
      setSelectedImages([]);
      setClientId("");
      setCategory("");
      setDescription("");
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-center text-xl font-bold text-[#0F4C75]">
            Add Inspiration
          </DialogTitle>
          <Tabs
            value={uploadMode}
            onValueChange={(v) => setUploadMode(v as "client" | "admin")}
            className="w-full mt-4"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="client">Client Upload</TabsTrigger>
              <TabsTrigger value="admin">Admin Upload</TabsTrigger>
            </TabsList>
          </Tabs>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 pt-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            {/* Left Side - Upload Area */}
            <div className="space-y-4 flex flex-col">
              <div className="border-2 border-dashed border-blue-200 rounded-lg p-8 text-center bg-blue-50/50 hover:bg-blue-50 transition-colors relative flex-1 flex flex-col items-center justify-center min-h-[300px]">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Upload className="h-10 w-10 text-gray-400" />
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold text-[#0F4C75]">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </div>
                  <div className="text-xs text-gray-400">
                    SVG, PNG, JPG or GIF (max. 800x400px)
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="mt-4 border-[#0F4C75] text-[#0F4C75] hover:bg-[#0F4C75] hover:text-white pointer-events-none"
                >
                  Browse File
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    or
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={() => toast.info("Pinterest integration coming soon!")}
              >
                Save From Pinterest
              </Button>

              {/* Selected Images Preview */}
              {selectedImages.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Images ({selectedImages.length})</Label>
                  <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                    {selectedImages.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-20 object-cover rounded border"
                        />
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Form Fields */}
            <div className="space-y-6 flex flex-col h-full">
              <div className="space-y-4 flex-1">
                <h3 className="font-semibold text-gray-900">
                  Inspiration Detail
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="category">Categories</Label>
                  <Input
                    id="category"
                    placeholder="Add Tags or categories Eg Wedding gown"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-12 bg-white border-[#0F4C75] focus-visible:ring-[#0F4C75]"
                  />
                </div>

                {uploadMode === "client" && (
                  <div className="space-y-2">
                    <Label htmlFor="client">Client Name</Label>
                    <Select value={clientId} onValueChange={setClientId}>
                      <SelectTrigger
                        id="client"
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
                )}

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Additional Information (Optional)
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="My client love the net used and want the exact size but the beads should be plenty and the gown should be full"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-white min-h-[150px] border-[#0F4C75] focus-visible:ring-[#0F4C75]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <Button
                  onClick={handleUpload}
                  disabled={
                    (uploadMode === "admin"
                      ? adminUploadMutation.isPending
                      : clientUploadMutation.isPending) ||
                    selectedImages.length === 0
                  }
                  className="w-full h-12 bg-[#0F4C75] hover:bg-[#0F4C75]/90 text-white"
                >
                  {(
                    uploadMode === "admin"
                      ? adminUploadMutation.isPending
                      : clientUploadMutation.isPending
                  )
                    ? "Saving..."
                    : "Save Inspiration"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
