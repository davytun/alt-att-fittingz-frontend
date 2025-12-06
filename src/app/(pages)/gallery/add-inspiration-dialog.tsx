"use client";

import { CheckCircle2, Loader2, Upload, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useClientList } from "@/hooks/api/use-clients";
import {
  useUploadAdminImages,
  useUploadClientImages,
} from "@/hooks/api/use-styles";

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
  const [isDragging, setIsDragging] = useState(false);

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
      toast.success(`${filesArray.length} image(s) added`);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const filesArray = Array.from(e.dataTransfer.files);
    const imageFiles = filesArray.filter((file) =>
      file.type.startsWith("image/"),
    );

    const MAX_SIZE = 5 * 1024 * 1024;
    const oversizedFiles = imageFiles.filter((file) => file.size > MAX_SIZE);

    if (oversizedFiles.length > 0) {
      toast.error("Some files are too large. Max size is 5MB per file.");
      return;
    }

    if (imageFiles.length > 0) {
      setSelectedImages((prev) => [...prev, ...imageFiles]);
      toast.success(`${imageFiles.length} image(s) added`);
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
      toast.success("Inspiration(s) added successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload. Please try again.");
    }
  };

  const isUploading =
    uploadMode === "admin"
      ? adminUploadMutation.isPending
      : clientUploadMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-7xl max-h-[95vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="border-b border-gray-200 p-6 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50">
          <DialogTitle className="text-center text-2xl font-bold text-gray-900">
            Add New Inspiration
          </DialogTitle>
          <Tabs
            value={uploadMode}
            onValueChange={(v) => setUploadMode(v as "client" | "admin")}
            className="w-full mt-4"
          >
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-11">
              <TabsTrigger value="client" className="text-sm font-medium">
                Client Upload
              </TabsTrigger>
              <TabsTrigger value="admin" className="text-sm font-medium">
                Admin Library
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Left Side - Upload Area */}
            <div className="space-y-6 flex flex-col">
              <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center relative flex-1 flex flex-col items-center justify-center min-h-[350px] transition-all duration-300 ${
                  isDragging
                    ? "border-[#0F4C75] bg-blue-50 scale-[1.02]"
                    : "border-gray-300 bg-gradient-to-br from-gray-50 to-blue-50/30 hover:border-blue-400 hover:bg-blue-50/50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
                  <div className="rounded-full bg-blue-100 p-6">
                    <Upload className="h-12 w-12 text-[#0F4C75]" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-base text-gray-700">
                      <span className="font-semibold text-[#0F4C75]">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </div>
                    <div className="text-sm text-gray-500">
                      SVG, PNG, JPG or GIF (max. 5MB per file)
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-2 border-2 border-[#0F4C75] text-[#0F4C75] hover:bg-[#0F4C75] hover:text-white transition-all shadow-sm"
                  >
                    Browse Files
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-gray-500 font-medium">
                    or
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full h-12 border-2 border-pink-200 text-pink-600 hover:bg-pink-50 hover:text-pink-700 hover:border-pink-300 transition-all shadow-sm"
                onClick={() => toast.info("Pinterest integration coming soon!")}
              >
                <svg
                  className="mr-2 h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
                Save From Pinterest
              </Button>

              {/* Selected Images Preview */}
              {selectedImages.length > 0 && (
                <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold text-gray-900">
                      Selected Images
                    </Label>
                    <span className="rounded-full bg-[#0F4C75] px-3 py-1 text-xs font-semibold text-white">
                      {selectedImages.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto">
                    {selectedImages.map((file, index) => (
                      <div
                        key={index}
                        className="relative group aspect-square rounded-lg overflow-hidden"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200" />
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 hover:scale-110 shadow-lg"
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
            <div className="space-y-6 flex flex-col">
              <div className="space-y-5 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-1 w-1 rounded-full bg-[#0F4C75]" />
                  <h3 className="font-semibold text-lg text-gray-900">
                    Inspiration Details
                  </h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">
                    Category / Tags
                  </Label>
                  <Input
                    id="category"
                    placeholder="e.g. Wedding Gown, Evening Wear, Bridal"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-12 bg-white border-gray-300 focus-visible:ring-2 focus-visible:ring-[#0F4C75] focus-visible:border-[#0F4C75] transition-all"
                  />
                  <p className="text-xs text-gray-500">
                    Add tags to help organize and find this inspiration later
                  </p>
                </div>

                {uploadMode === "client" && (
                  <div className="space-y-2">
                    <Label htmlFor="client" className="text-sm font-medium">
                      Client Name <span className="text-red-500">*</span>
                    </Label>
                    <Select value={clientId} onValueChange={setClientId}>
                      <SelectTrigger
                        id="client"
                        className="h-12 bg-white border-gray-300 focus:ring-2 focus:ring-[#0F4C75] transition-all"
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
                  <Label htmlFor="description" className="text-sm font-medium">
                    Additional Information{" "}
                    <span className="text-gray-400">(Optional)</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="My client loves the net used and wants the exact size, but the beads should be plenty and the gown should be full..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-white min-h-[160px] border-gray-300 focus-visible:ring-2 focus-visible:ring-[#0F4C75] focus-visible:border-[#0F4C75] transition-all resize-none"
                  />
                  <p className="text-xs text-gray-500">
                    Add any special notes, requirements, or preferences
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-3">
                <Button
                  onClick={handleUpload}
                  disabled={isUploading || selectedImages.length === 0}
                  className="w-full h-13 bg-gradient-to-r from-[#0F4C75] to-[#1a5a8f] hover:from-[#0F4C75]/90 hover:to-[#1a5a8f]/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Save{" "}
                      {selectedImages.length > 0 &&
                        `(${selectedImages.length})`}{" "}
                      Inspiration
                      {selectedImages.length !== 1 && "s"}
                    </>
                  )}
                </Button>
                {selectedImages.length > 0 && (
                  <p className="text-center text-xs text-gray-500">
                    Ready to upload {selectedImages.length} image
                    {selectedImages.length !== 1 && "s"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
