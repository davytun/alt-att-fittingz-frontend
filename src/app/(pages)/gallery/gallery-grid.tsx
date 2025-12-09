"use client";

import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Image as ImageIcon,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClientList } from "@/hooks/api/use-clients";
import {
  useAdminStyleImages,
  useDeleteMultipleImages,
} from "@/hooks/api/use-styles";
import { useAuthStore } from "@/lib/store/auth-store";
import type { StyleImage } from "@/types/style";
import { AddInspirationDialog } from "./add-inspiration-dialog";
import { EditInspirationDialog } from "./edit-inspiration-dialog";

export function GalleryGrid() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string>("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingInspiration, setEditingInspiration] =
    useState<StyleImage | null>(null);
  const [selectedImageIds, setSelectedImageIds] = useState<Set<string>>(
    new Set(),
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
      if (selectedClientId !== "all" && image.clientId !== selectedClientId) {
        return false;
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const categoryMatch = (image.category || "")
          .toLowerCase()
          .includes(query);
        const descriptionMatch = (image.description || "")
          .toLowerCase()
          .includes(query);
        return categoryMatch || descriptionMatch;
      }

      return true;
    });
  }, [imagesData, selectedClientId, searchQuery]);

  const { isAuthenticated, isLoading: authLoading } = useAuthStore();

  const getClientName = (clientId?: string) => {
    if (!clientId) return "Admin Library";
    const client = clientsData?.data?.find((c) => c.id === clientId);
    return client ? client.name : "Admin Library";
  };

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
        `Are you sure you want to delete ${selectedImageIds.size} image(s)? This action cannot be undone.`,
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

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedClientId("all");
  };

  const hasActiveFilters = searchQuery !== "" || selectedClientId !== "all";

  return (
    <div className="space-y-6">
      {/* Enhanced Search & Filter Bar */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4">
          {/* Top Row */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by category or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 pl-11 pr-10 border-gray-300 bg-gray-50 focus-visible:ring-2 focus-visible:ring-[#0F4C75] focus-visible:border-[#0F4C75] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <Select
                value={selectedClientId}
                onValueChange={setSelectedClientId}
              >
                <SelectTrigger className="w-[220px] h-12 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-[#0F4C75] transition-all">
                  <Filter className="mr-2 h-4 w-4 text-gray-500" />
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
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="h-12 text-gray-600 hover:text-gray-900"
                >
                  Clear Filters
                </Button>
              )}

              <Button
                variant={isSelectionMode ? "default" : "outline"}
                onClick={() => {
                  setIsSelectionMode(!isSelectionMode);
                  setSelectedImageIds(new Set());
                }}
                className={`h-12 min-w-[100px] transition-all ${
                  isSelectionMode
                    ? "bg-[#0F4C75] text-white hover:bg-[#0F4C75]/90"
                    : "border-[#0F4C75] text-[#0F4C75] hover:bg-[#0F4C75]/5"
                }`}
              >
                {isSelectionMode ? "Cancel" : "Select"}
              </Button>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">Active filters:</span>
              {searchQuery && (
                <Badge
                  variant="secondary"
                  className="gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100"
                >
                  Search: {searchQuery}
                  <button
                    onClick={() => setSearchQuery("")}
                    className="ml-1 hover:text-blue-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedClientId !== "all" && (
                <Badge
                  variant="secondary"
                  className="gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100"
                >
                  Client:{" "}
                  {clientsData?.data?.find((c) => c.id === selectedClientId)
                    ?.name || "Unknown"}
                  <button
                    onClick={() => setSelectedClientId("all")}
                    className="ml-1 hover:text-blue-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Bulk Action Bar */}
      {isSelectionMode && (
        <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 shadow-sm animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Checkbox
                checked={
                  selectedImageIds.size === filteredImages.length &&
                  filteredImages.length > 0
                }
                onCheckedChange={toggleSelectAll}
                className="h-5 w-5 border-2 border-blue-500 data-[state=checked]:bg-blue-600"
              />
              <div>
                <span className="text-base font-semibold text-gray-900">
                  {selectedImageIds.size} selected
                </span>
                <span className="ml-2 text-sm text-gray-600">
                  of {filteredImages.length} items
                </span>
              </div>
            </div>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={
                selectedImageIds.size === 0 || deleteMultipleMutation.isPending
              }
              className="gap-2 shadow-sm hover:shadow-md transition-all"
            >
              {deleteMultipleMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete Selected
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Gallery Grid with Enhanced States */}
      {!isAuthenticated && !authLoading ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-16 text-center">
          <ImageIcon className="mb-4 h-16 w-16 text-gray-400" />
          <h3 className="mb-2 text-xl font-semibold text-gray-900">
            Authentication Required
          </h3>
          <p className="text-gray-600">
            Please log in to view and manage inspirations.
          </p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-red-200 bg-red-50 p-16 text-center">
          <div className="mb-4 rounded-full bg-red-100 p-4">
            <X className="h-12 w-12 text-red-600" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-red-900">
            Failed to Load
          </h3>
          <p className="text-red-700">
            Unable to load inspirations. Please try again later.
          </p>
        </div>
      ) : isLoading || authLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"
            >
              <div className="h-full w-full bg-gradient-to-tr from-transparent via-white/20 to-transparent" />
            </div>
          ))}
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-16 text-center">
          <ImageIcon className="mb-4 h-16 w-16 text-gray-400" />
          <h3 className="mb-2 text-xl font-semibold text-gray-900">
            No Inspirations Found
          </h3>
          <p className="mb-6 text-gray-600">
            {hasActiveFilters
              ? "Try adjusting your filters to see more results."
              : "Start by adding your first inspiration."}
          </p>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="border-[#0F4C75] text-[#0F4C75]"
            >
              Clear All Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:gap-6">
          {filteredImages.map((image) => (
            <button
              key={image.id}
              type="button"
              onClick={() => {
                if (isSelectionMode) {
                  toggleImageSelection(image.id);
                } else {
                  setEditingInspiration(image);
                }
              }}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 border-0 p-0 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-[#0F4C75]/20"
            >
              <Image
                src={image.imageUrl}
                alt={image.category || "Inspiration"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Selection Checkbox */}
              {isSelectionMode && (
                <div className="absolute left-3 top-3 z-20">
                  <div
                    className="rounded-lg bg-white/95 p-1 shadow-lg backdrop-blur-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={selectedImageIds.has(image.id)}
                      onCheckedChange={() => {
                        toggleImageSelection(image.id);
                      }}
                      className="h-5 w-5 border-2 border-blue-500 data-[state=checked]:bg-blue-600"
                    />
                  </div>
                </div>
              )}

              {/* Category Badge */}
              {image.category && !isSelectionMode && (
                <div className="absolute right-3 top-3 z-10">
                  <Badge className="bg-white/95 text-gray-900 backdrop-blur-sm shadow-lg border-0">
                    {image.category}
                  </Badge>
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="mb-1 font-semibold text-base line-clamp-1">
                    {getClientName(image.clientId)}
                  </p>
                  {image.description && (
                    <p className="text-sm text-white/90 line-clamp-2">
                      {image.description}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Enhanced Pagination */}
      {!isLoading &&
        !isError &&
        imagesData?.data &&
        imagesData.data.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Items per page:
                  </span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(v) => {
                      setPageSize(Number(v));
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[100px] h-10 border-gray-300 bg-gray-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="24">24</SelectItem>
                      <SelectItem value="48">48</SelectItem>
                      <SelectItem value="96">96</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="h-6 w-px bg-gray-300 hidden sm:block" />
                <span className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {imagesData.data.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-900">
                    {imagesData.pagination?.total || imagesData.data.length}
                  </span>{" "}
                  results
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <span className="text-sm font-medium text-gray-700">
                  Page {page} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="h-10 w-10 p-0 border-gray-300 hover:bg-gray-100 disabled:opacity-40"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="h-10 w-10 p-0 border-gray-300 hover:bg-gray-100 disabled:opacity-40"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Enhanced Floating Action Button */}
      <Button
        onClick={() => setIsAddOpen(true)}
        className="fixed bottom-24 right-8 md:bottom-8 z-50 h-16 w-16 rounded-full bg-gradient-to-br from-[#0F4C75] to-[#1a5a8f] shadow-2xl hover:shadow-[0_20px_50px_rgba(15,76,117,0.4)] hover:scale-110 transition-all duration-300 group"
      >
        <Plus className="h-7 w-7 text-white transition-transform group-hover:rotate-90 duration-300" />
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
