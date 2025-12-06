"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  AlertCircle,
  Banknote,
  Calendar,
  CheckCircle,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
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
import { createOrderSchema } from "@/lib/order-schemas";
import type { CreateOrderRequest } from "@/types/order";

interface OrderFormProps {
  clientId: string;
  clientName: string;
}

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

// Form schema that matches the design
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
  deposit: z
    .number()
    .min(0, "Deposit must be positive")
    .max(999999999, "Deposit too large"),
  price: z
    .number()
    .min(0, "Total price must be positive")
    .max(999999999, "Price too large"),
  styleDescription: z.string().optional(),
  details: z.object({
    fabric: z.string(),
    color: z.string(),
    notes: z.string(),
  }),
});

type FormData = z.infer<typeof formSchema>;

export function OrderForm({ clientId, clientName }: OrderFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [styleImages, setStyleImages] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "PENDING_PAYMENT",
      currency: "NGN",
      deposit: 0,
      price: 0,
      styleDescription: "",
      note: "",
      measurementId: "",
      details: {
        fabric: "",
        color: "",
        notes: "",
      },
    },
  });

  // Watch values for calculations
  const deposit = watch("deposit");
  const totalPrice = watch("price");
  const outstandingBalance = totalPrice - deposit;

  // Fetch measurements for this client
  const { data: measurements = [] } = useQuery({
    queryKey: ["measurements", clientId],
    queryFn: () => measurementsApi.getMeasurements(clientId),
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: (data: CreateOrderRequest) =>
      ordersApi.createOrder(clientId, data),
    onSuccess: () => {
      // Invalidate orders cache so the list refetches
      queryClient.invalidateQueries({ queryKey: ["orders", clientId] });
      reset();
      setStyleImages([]);
      toast.success("Order created successfully!");
      router.push(`/clients/${clientId}`);
    },
    onError: (error: any) => {
      console.error("Order creation error:", error);
      console.error("Error status:", error?.status);
      console.error("Error details:", error);
      // APIError from our client has the message from backend
      const errorMessage = error?.message || "Failed to create order";
      toast.error(`Validation Error: ${errorMessage}`);
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log("Form submitted with data:", data);

    let styleImageIds: string[] = [];

    // Upload images first if any are selected
    if (styleImages.length > 0) {
      try {
        const { stylesApi } = await import("@/lib/api/styles");
        const uploadedImages = await stylesApi.uploadClientImages(clientId, {
          images: styleImages,
          category: "order",
          description: "Order style inspiration",
        });
        styleImageIds = uploadedImages.map((img) => img.id);
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error(
          "Failed to upload images. Order will be created without images.",
        );
      }
    }

    const orderData: CreateOrderRequest = {
      details: data.details,
      price: data.price,
      currency: data.currency,
      dueDate: format(data.dueDate, "yyyy-MM-dd"),
      status: data.status,
      deposit: data.deposit,
      styleDescription: data.styleDescription || "Style inspiration attached",
      note: data.note || "",
      measurementId: data.measurementId || undefined,
      styleImageIds,
    };

    console.log("Sending order data to API:", orderData);
    createOrderMutation.mutate(orderData);
  };

  const onError = (errors: any) => {
    console.log("Form validation errors:", errors);
    toast.error("Please fix the form errors before submitting");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setStyleImages(Array.from(e.target.files));
    }
  };

  // Log form errors on change
  if (Object.keys(errors).length > 0) {
    console.log("Current form errors:", errors);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="mx-auto p-6 space-y-8"
    >
      {/* Error Banner */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold mb-2">
            Please fix the following errors:
          </h3>
          <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
            {errors.dueDate && <li>Due date is required</li>}
            {errors.deposit && <li>{errors.deposit.message}</li>}
            {errors.price && <li>{errors.price.message}</li>}
            {errors.styleDescription && (
              <li>{errors.styleDescription.message}</li>
            )}
            {errors.status && <li>{errors.status.message}</li>}
            {errors.currency && <li>{errors.currency.message}</li>}
          </ul>
        </div>
      )}

      {/* Order Details Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={watch("status")}
              onValueChange={(value) =>
                setValue("status", value as FormData["status"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={watch("currency")}
              onValueChange={(value) => setValue("currency", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Client (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            <Input value={clientName} disabled className="bg-gray-50" />
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
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
            {errors.dueDate && (
              <p className="text-sm text-red-600">{errors.dueDate.message}</p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="note">Note</Label>
          <Textarea
            {...register("note")}
            placeholder="Prefers a slight loose fit around the chest"
            rows={3}
            className="resize-none"
          />
        </div>
      </div>

      {/* Measurement Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Measurement</h2>

        <div className="space-y-2">
          <Label htmlFor="measurementId">Link Client Measurement</Label>
          <Select
            value={watch("measurementId") || ""}
            onValueChange={(value) => setValue("measurementId", value || "")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select measurement" />
            </SelectTrigger>
            <SelectContent>
              {measurements.map((measurement) => (
                <SelectItem key={measurement.id} value={measurement.id}>
                  {measurement.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="button" variant="outline" className="w-full">
          + Add New Measurement
        </Button>
      </div>

      {/* Details Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Details</h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Fabric */}
          <div className="space-y-2">
            <Label htmlFor="fabric">Fabric</Label>
            <Input
              {...register("details.fabric")}
              placeholder="e.g., Cotton, Silk, Linen"
            />
            {errors.details?.fabric && (
              <p className="text-sm text-red-600">
                {errors.details.fabric.message}
              </p>
            )}
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Input
              {...register("details.color")}
              placeholder="e.g., Navy Blue, White"
            />
            {errors.details?.color && (
              <p className="text-sm text-red-600">
                {errors.details.color.message}
              </p>
            )}
          </div>
        </div>

        {/* Detail Notes */}
        <div className="space-y-2">
          <Label htmlFor="details.notes">Detail Notes</Label>
          <Textarea
            {...register("details.notes")}
            placeholder="Additional details about the order"
            rows={3}
            className="resize-none"
          />
          {errors.details?.notes && (
            <p className="text-sm text-red-600">
              {errors.details.notes.message}
            </p>
          )}
        </div>
      </div>

      {/* Order Amount Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Order Amount</h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Deposit */}
          <div className="space-y-2">
            <Label htmlFor="deposit">Deposit</Label>
            <Input
              {...register("deposit", { valueAsNumber: true })}
              type="number"
              placeholder="0"
              min="0"
              max="999999999"
              step="1"
            />
            {errors.deposit && (
              <p className="text-sm text-red-600">{errors.deposit.message}</p>
            )}
          </div>

          {/* Total Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Total Price</Label>
            <Input
              {...register("price", { valueAsNumber: true })}
              type="number"
              placeholder="1200"
              min="0"
              max="999999999"
              step="1"
            />
            {errors.price && (
              <p className="text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Style Inspirations Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Style Inspirations
        </h2>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4 space-y-2">
            <Button type="button" variant="outline" className="w-full" asChild>
              <label>
                <Upload className="mr-2 h-4 w-4" />
                Attach
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full text-red-500 border-red-200"
            >
              Attach From Pinterest
            </Button>
          </div>
          {styleImages.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              {styleImages.length} file(s) selected
            </p>
          )}
        </div>

        {/* Style Description - Hidden field for now */}
        <input
          type="hidden"
          {...register("styleDescription")}
          value="Style inspiration attached"
        />
      </div>

      {/* Order Summary Section */}
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
                {watch("currency")} {totalPrice.toLocaleString()}
              </p>
            </div>
          </div>

          {deposit > 0 && (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Deposit</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {watch("currency")} {deposit.toLocaleString()}
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
                    {watch("currency")} {outstandingBalance.toLocaleString()}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-[#1e3a5f] hover:bg-[#152a45]"
          disabled={createOrderMutation.isPending}
        >
          {createOrderMutation.isPending ? "Saving..." : "Save Order"}
        </Button>
      </div>
    </form>
  );
}
