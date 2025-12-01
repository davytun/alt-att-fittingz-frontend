"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAdminStyleImages,
  useDeleteMultipleImages,
} from "@/hooks/api/use-styles";
import { useClientList } from "@/hooks/api/use-clients";
import { AddInspirationDialog } from "./add-inspiration-dialog";
import { EditInspirationDialog } from "./edit-inspiration-dialog";
import type { StyleImage } from "@/types/style";
import { Checkbox } from "@/components/ui/checkbox";

export function GalleryGrid() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string>("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingInspiration, setEditingInspiration] =
    useState<StyleImage | null>(null);
  const [selectedImageIds, setSelectedImageIds] = useState<Set<string>>(
    new Set()
  );
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const {
    data: imagesData,
    isLoading,
    isError,
  } = useAdminStyleImages(page, pageSize);
  const { data: clientsData } = useClientList(1, 100);
  const deleteMultipleMutation = useDeleteMultipleImages();

  const totalPages = imagesData?.pagination?.totalPages || 1;

  const filteredImages = useMemo(() => {
    if (!imagesData?.data) return [];

    return imagesData.data.filter((image) => {
      // Filter by Client
      if (selectedClientId !== "all" && image.clientId !== selectedClientId) {
        return false;
      }

      // Filter by Search Query (Category, Description, Client Name if available)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const categoryMatch = (image.category || "")
          .toLowerCase()
          .includes(query);
        const descriptionMatch = (image.description || "")
          .toLowerCase()
          .includes(query);
        // We don't have client name directly on the image object usually, unless populated.
        // Assuming basic filtering for now.
        return categoryMatch || descriptionMatch;
      }

      return true;
    });
  }, [imagesData, selectedClientId, searchQuery]);

  // Helper to find client name for an image
  const getClientName = (clientId?: string) => {
    if (!clientId) return "Admin Library";
    const client = clientsData?.data?.find((c) => c.id === clientId);
    return client ? `${client.name}` : "Admin Library";
  };

  // Bulk selection helpers
  const toggleImageSelection = (imageId: string) => {
    const newSelection = new Set(selectedImageIds);
    if (newSelection.has(imageId)) {
      newSelection.delete(imageId);
    } else {
      newSelection.add(imageId);
    }
    setSelectedImageIds(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedImageIds.size === filteredImages.length) {
      setSelectedImageIds(new Set());
    } else {
      setSelectedImageIds(new Set(filteredImages.map((img) => img.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedImageIds.size === 0) return;

    if (
      !confirm(
        `Are you sure you want to delete ${selectedImageIds.size} image(s)?`
      )
    )
      return;

    try {
      await deleteMultipleMutation.mutateAsync({
        imageIds: Array.from(selectedImageIds),
      });
      setSelectedImageIds(new Set());
      setIsSelectionMode(false);
    } catch (error) {
      console.error("Bulk delete error:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 pl-9 bg-white border-[#0F4C75] focus-visible:ring-[#0F4C75]"
            />
          </div>

          <Select value={selectedClientId} onValueChange={setSelectedClientId}>
            <SelectTrigger className="w-[200px] h-12 bg-white border-[#0F4C75] focus:ring-[#0F4C75]">
              <SelectValue placeholder="Filter by Client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              {clientsData?.data?.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setIsSelectionMode(!isSelectionMode);
              setSelectedImageIds(new Set());
            }}
            className="h-12 border-[#0F4C75] text-[#0F4C75]"
          >
            {isSelectionMode ? "Cancel" : "Select"}
          </Button>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {isSelectionMode && (
        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-4">
            <Checkbox
              checked={
                selectedImageIds.size === filteredImages.length &&
                filteredImages.length > 0
              }
              onCheckedChange={toggleSelectAll}
            />
            <span className="text-sm font-medium text-gray-700">
              {selectedImageIds.size} of {filteredImages.length} selected
            </span>
          </div>
          <Button
            variant="destructive"
            onClick={handleBulkDelete}
            disabled={
              selectedImageIds.size === 0 || deleteMultipleMutation.isPending
            }
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {deleteMultipleMutation.isPending
              ? "Deleting..."
              : "Delete Selected"}
          </Button>
        </div>
      )}

      {/* Grid */}
      {isError ? (
        <div className="text-center py-12 text-red-500">
          Failed to load inspirations. Please try again later.
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="aspect-3/4 bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No inspirations found.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              onClick={() => {
                if (isSelectionMode) {
                  toggleImageSelection(image.id);
                } else {
                  setEditingInspiration(image);
                }
              }}
              className="group relative aspect-3/4 cursor-pointer overflow-hidden rounded-xl bg-gray-100"
            >
              <img
                src={image.imageUrl}
                alt={image.category || "Inspiration"}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Selection Checkbox */}
              {isSelectionMode && (
                <div className="absolute top-2 left-2 z-10">
                  <Checkbox
                    checked={selectedImageIds.has(image.id)}
                    onCheckedChange={() => toggleImageSelection(image.id)}
                    className="bg-white border-2"
                  />
                </div>
              )}

              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <p className="font-semibold text-sm truncate">
                    {getClientName(image.clientId)}
                  </p>
                  <p className="text-xs opacity-90 truncate">
                    {image.category || "No Category"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!isLoading &&
        !isError &&
        imagesData?.data &&
        imagesData.data.length > 0 && (
          <div className="flex flex-col gap-4 pt-6 border-t border-gray-200 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
              <span className="text-sm text-gray-600">Items per page:</span>
              <Select
                value={pageSize.toString()}
                onValueChange={(v) => {
                  setPageSize(Number(v));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[100px] h-10 bg-white border-[#0F4C75]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="48">48</SelectItem>
                  <SelectItem value="96">96</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600">
                Showing {imagesData.data.length} of{" "}
                {imagesData.pagination?.total || imagesData.data.length}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-10 px-3 border-[#0F4C75]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="h-10 px-3 border-[#0F4C75]"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

      {/* Floating Action Button for Mobile / Fixed Button for Desktop */}
      <Button
        onClick={() => setIsAddOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-[#0F4C75] shadow-lg hover:bg-[#0F4C75]/90 flex items-center justify-center z-50"
      >
        <Plus className="h-6 w-6 text-white" />
      </Button>

      {/* Modals */}
      <AddInspirationDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
      <EditInspirationDialog
        open={!!editingInspiration}
        onOpenChange={(open) => !open && setEditingInspiration(null)}
        inspiration={editingInspiration}
      />
    </div>
  );
}
