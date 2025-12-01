"use client";

import { use } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Banknote,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { measurementsApi } from "@/lib/api/measurements";
import { ordersApi } from "@/lib/api/orders";
import type { UpdateOrderRequest } from "@/types/order";

const ORDER_STATUSES = [
  { value: "PENDING_PAYMENT", label: "Pending Payment" },
  { value: "PROCESSING", label: "Processing" },
  { value: "READY_FOR_PICKUP", label: "Ready for Pickup" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
] as const;

const CURRENCIES = [
  { value: "NGN", label: "NGN" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
] as const;

const formSchema = z.object({
  status: z.enum([
    "PENDING_PAYMENT",
    "PROCESSING",
    "READY_FOR_PICKUP",
    "SHIPPED",
    "DELIVERED",
    "COMPLETED",
    "CANCELLED",
  ]),
  currency: z.string(),
  dueDate: z.date(),
  note: z.string().optional(),
  measurementId: z.string().optional(),
  deposit: z.number().min(0, "Deposit must be positive"),
  price: z.number().min(0, "Total price must be positive"),
  details: z.object({
    fabric: z.string(),
    color: z.string(),
    notes: z.string(),
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string; orderId: string }>;
}) {
  const { id: clientId, orderId } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Fetch order data
  const { data: order, isLoading } = useQuery({
    queryKey: ["order", clientId, orderId],
    queryFn: () => ordersApi.getOrder(clientId, orderId),
  });

  // Fetch measurements
  const { data: measurements = [] } = useQuery({
    queryKey: ["measurements", clientId],
    queryFn: () => measurementsApi.getMeasurements(clientId),
  });

  const { register, handleSubmit, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    values: order
      ? {
          status: order.status,
          currency: order.currency,
          dueDate: new Date(order.dueDate),
          note: order.note || "",
          measurementId: order.measurementId || "",
          deposit:
            typeof order.deposit === "string"
              ? parseFloat(order.deposit)
              : order.deposit,
          price:
            typeof order.price === "string"
              ? parseFloat(order.price)
              : order.price,
          details: order.details,
        }
      : undefined,
  });

  // Update order mutation
  const updateOrderMutation = useMutation({
    mutationFn: (data: UpdateOrderRequest) =>
      ordersApi.updateOrder(clientId, orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", clientId, orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders", clientId] });
      toast.success("Order updated successfully!");
      setIsEditing(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update order");
    },
  });

  // Delete order mutation
  const deleteOrderMutation = useMutation({
    mutationFn: () => ordersApi.deleteOrder(clientId, orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", clientId] });
      toast.success("Order deleted successfully!");
      router.push(`/clients/${clientId}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete order");
    },
  });

  const onSubmit = (data: FormData) => {
    const updateData: UpdateOrderRequest = {
      details: data.details,
      price: data.price,
      currency: data.currency,
      dueDate: format(data.dueDate, "yyyy-MM-dd"),
      status: data.status,
      deposit: data.deposit,
      note: data.note || "",
      measurementId: data.measurementId,
    };

    updateOrderMutation.mutate(updateData);
  };

  const handleDelete = () => {
    deleteOrderMutation.mutate();
    setShowDeleteDialog(false);
  };

  // Watch values for calculations
  const deposit = watch("deposit");
  const totalPrice = watch("price");
  const outstandingBalance = totalPrice - deposit;

  if (isLoading || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Link
        href={`/clients/${clientId}`}
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span className="text-lg font-semibold">Back to Client Profile</span>
      </Link>
      <section className="relative overflow-hidden rounded-b-[3rem] bg-[#0F4C75] px-6 py-12 text-white shadow-sm md:px-12">
        <div className="relative z-10 flex gap-2 flex-row justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-white/80">
              {isEditing ? "Edit Order" : "Order Details"}
            </p>
            <h1 className="text-2xl font-bold md:text-3xl">
              {order.orderNumber}
            </h1>
          </div>
          <div>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-white text-[#0F4C75] hover:bg-[#ffffff]/80 hover:text-[#0F4C75]"
              >
                Edit Order
              </Button>
            )}
            {isEditing && (
              <Button
                onClick={() => setIsEditing(false)}
                className="bg-white text-[#0F4C75] hover:bg-[#ffffff]/80 hover:text-[#0F4C75]"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>

        <div className="pointer-events-none absolute -right-16 -bottom-20 h-56 w-56 rounded-full bg-white/10 md:-right-6 md:-bottom-16" />
      </section>
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto p-6 space-y-8">
        {/* Order Details Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              {isEditing ? (
                <Select
                  value={watch("status")}
                  onValueChange={(value) =>
                    setValue("status", value as FormData["status"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={
                    ORDER_STATUSES.find((s) => s.value === order.status)?.label
                  }
                  disabled
                  className="bg-gray-50"
                />
              )}
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              {isEditing ? (
                <Select
                  value={watch("currency")}
                  onValueChange={(value) => setValue("currency", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input value={order.currency} disabled className="bg-gray-50" />
              )}
            </div>

            {/* Client */}
            <div className="space-y-2">
              <Label>Client</Label>
              <Input
                value={order.client.name}
                disabled
                className="bg-gray-50"
              />
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              {isEditing ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {watch("dueDate") ? (
                        format(watch("dueDate"), "MM/dd/yy")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={watch("dueDate")}
                      onSelect={(date) => date && setValue("dueDate", date)}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                <Input
                  value={format(new Date(order.dueDate), "MMM dd, yyyy")}
                  disabled
                  className="bg-gray-50"
                />
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="note">Notes</Label>
            {isEditing ? (
              <Textarea
                {...register("note")}
                rows={3}
                className="resize-none"
              />
            ) : (
              <Textarea
                value={order.note || ""}
                disabled
                className="bg-gray-50 resize-none"
                rows={3}
              />
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Details</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fabric">Fabric</Label>
              {isEditing ? (
                <Input {...register("details.fabric")} />
              ) : (
                <Input
                  value={order.details.fabric || ""}
                  disabled
                  className="bg-gray-50"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              {isEditing ? (
                <Input {...register("details.color")} />
              ) : (
                <Input
                  value={order.details.color || ""}
                  disabled
                  className="bg-gray-50"
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details.notes">Detail Notes</Label>
            {isEditing ? (
              <Textarea
                {...register("details.notes")}
                rows={3}
                className="resize-none"
              />
            ) : (
              <Textarea
                value={order.details.notes || ""}
                disabled
                className="bg-gray-50 resize-none"
                rows={3}
              />
            )}
          </div>
        </div>

        {/* Measurement Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Measurement</h2>
            <Link
              href={`/clients/${clientId}/measurements`}
              className="text-sm text-blue-600 hover:underline"
            >
              View All
            </Link>
          </div>

          {isEditing ? (
            <Select
              value={watch("measurementId")}
              onValueChange={(value) => setValue("measurementId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Link measurement" />
              </SelectTrigger>
              <SelectContent>
                {measurements.map((measurement) => (
                  <SelectItem key={measurement.id} value={measurement.id}>
                    {measurement.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <>
              {/* Find linked measurement from the order */}
              {(() => {
                // First try to use the measurement from the order response
                let linkedMeasurement = order.measurement;

                // If not available, try to find it in the measurements list
                if (!linkedMeasurement && order.measurementId) {
                  linkedMeasurement = measurements.find(
                    (m) => m.id === order.measurementId
                  );
                }

                if (!linkedMeasurement) {
                  return (
                    <div className="text-center py-4 text-gray-500 border-2 border-dashed rounded-lg">
                      <p>No measurement linked</p>
                      <p className="text-sm mt-1">
                        Click "Edit Order" to link a measurement
                      </p>
                    </div>
                  );
                }

                const fields = linkedMeasurement.fields as Record<
                  string,
                  unknown
                >;
                const fieldEntries = Object.entries(fields);

                if (fieldEntries.length === 0) {
                  return (
                    <Input
                      value={linkedMeasurement.name}
                      disabled
                      className="bg-gray-50"
                    />
                  );
                }

                return (
                  <div className="space-y-4">
                    <Input
                      value={linkedMeasurement.name}
                      disabled
                      className="bg-gray-50 font-semibold"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      {fieldEntries.map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <Label className="capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </Label>
                          <Input
                            value={String(value || "")}
                            disabled
                            className="bg-gray-50"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </>
          )}
        </div>

        {/* Order Amount Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Order Amount</h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Deposit */}
            <div className="space-y-2">
              <Label htmlFor="deposit">Deposit</Label>
              {isEditing ? (
                <Input
                  {...register("deposit", { valueAsNumber: true })}
                  type="number"
                  min="0"
                />
              ) : (
                <Input
                  value={(typeof order.deposit === "string"
                    ? parseFloat(order.deposit)
                    : order.deposit
                  ).toLocaleString()}
                  disabled
                  className="bg-gray-50"
                />
              )}
            </div>

            {/* Total Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Total Price</Label>
              {isEditing ? (
                <Input
                  {...register("price", { valueAsNumber: true })}
                  type="number"
                  min="0"
                />
              ) : (
                <Input
                  value={(typeof order.price === "string"
                    ? parseFloat(order.price)
                    : order.price
                  ).toLocaleString()}
                  disabled
                  className="bg-gray-50"
                />
              )}
            </div>
          </div>
        </div>

        {/* Style Inspirations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Style Inspirations
              {order.styleImages && order.styleImages.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({order.styleImages.length})
                </span>
              )}
            </h2>
          </div>

          {order.styleImages && order.styleImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {order.styleImages.map((img) => (
                <div
                  key={img.styleImage.id}
                  className="relative aspect-square w-full rounded-lg overflow-hidden group"
                >
                  <Image
                    src={img.styleImage.imageUrl}
                    alt={img.styleImage.description || "Style inspiration"}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {img.styleImage.description && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-sm line-clamp-2">
                        {img.styleImage.description}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <p>No style inspirations linked to this order</p>
              <p className="text-sm mt-1">
                Style inspirations can be added from the client profile
              </p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center">
                <Banknote className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  {watch("currency")}{" "}
                  {(isEditing
                    ? totalPrice
                    : typeof order.price === "string"
                    ? parseFloat(order.price)
                    : order.price
                  ).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="text-xl font-semibold text-gray-900">
                  {watch("currency")} {(order.totalPaid || 0).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Outstanding Balance</p>
                <p className="text-xl font-semibold text-gray-900">
                  {watch("currency")}{" "}
                  {(isEditing
                    ? outstandingBalance
                    : order.outstandingBalance ||
                      (typeof order.price === "string"
                        ? parseFloat(order.price)
                        : order.price) -
                        (typeof order.deposit === "string"
                          ? parseFloat(order.deposit)
                          : order.deposit)
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        {isEditing ? (
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#1e3a5f] hover:bg-[#152a45]"
              disabled={updateOrderMutation.isPending}
            >
              {updateOrderMutation.isPending ? "Updating..." : "Update Order"}
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="destructive"
            className="w-full bg-red-700 hover:bg-red-600"
            onClick={() => setShowDeleteDialog(true)}
            disabled={deleteOrderMutation.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Order
          </Button>
        )}
      </form>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete order{" "}
              <strong>{order.orderNumber}</strong>? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleteOrderMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="bg-red-700 hover:bg-red-600"
              onClick={handleDelete}
              disabled={deleteOrderMutation.isPending}
            >
              {deleteOrderMutation.isPending ? "Deleting..." : "Delete Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
