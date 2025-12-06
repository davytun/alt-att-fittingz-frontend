"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClient, useUpdateClient } from "@/hooks/api/use-clients";
import {
  type UpdateClientFormData,
  updateClientSchema,
} from "@/lib/client-schemas";

const genders = ["Male", "Female", "Other"] as const;

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;

  const {
    data: clientData,
    isLoading: isLoadingClient,
    error,
  } = useClient(clientId);
  const updateMutation = useUpdateClient(clientId);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateClientFormData>({
    resolver: zodResolver(updateClientSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      gender: "",
    },
  });

  // Pre-populate form when client data is loaded
  useEffect(() => {
    if (clientData) {
      reset({
        name: clientData.name,
        phone: clientData.phone,
        email: clientData.email,
        gender: clientData.gender,
      });
    }
  }, [clientData, reset]);

  const onSubmit = async (data: UpdateClientFormData) => {
    try {
      await updateMutation.mutateAsync(data);
      toast.success("Client updated successfully!");
      router.push(`/clients/${clientId}`);
    } catch (error) {
      toast.error("Failed to update client. Please try again.");
      console.error(error);
    }
  };

  if (isLoadingClient) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#0F4C75]" />
          <p className="text-gray-600">Loading client data...</p>
        </div>
      </div>
    );
  }

  if (error || !clientData) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Client Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The client you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/clients")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Clients
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="relative overflow-hidden rounded-b-[3rem] bg-[#0F4C75] px-6 py-12 text-white shadow-sm md:px-12">
        <div className="relative z-10 flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.2em] text-white/80">
            Edit Client
          </p>
          <h1 className="text-2xl font-bold md:text-3xl">
            Update client information for {clientData.name}
          </h1>
        </div>
        <div className="pointer-events-none absolute -right-16 -bottom-20 h-56 w-56 rounded-full bg-white/10 md:-right-6 md:-bottom-16" />
      </section>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-4xl space-y-8"
      >
        <Card className="rounded-3xl border border-[#E4ECFA] bg-white">
          <CardHeader className="px-6 pt-8 pb-0 text-center md:px-12">
            <CardTitle className="text-xl font-semibold text-[#0F4C75] md:text-2xl">
              Client Information
            </CardTitle>
            <CardDescription className="mt-2 text-sm text-[#6C7A89]">
              Update the client details below
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-12 pt-8 md:px-12 space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-semibold text-[#0F4C75]"
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter client name"
                  {...register("name")}
                  className="h-12 rounded-xl border-2 border-[#0F4C75] focus-visible:ring-0"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-semibold text-[#0F4C75]"
                >
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  {...register("phone")}
                  className="h-12 rounded-xl border-2 border-[#0F4C75] focus-visible:ring-0"
                />
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-[#0F4C75]"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="client@example.com"
                  {...register("email")}
                  className="h-12 rounded-xl border-2 border-[#0F4C75] focus-visible:ring-0"
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="gender"
                  className="text-sm font-semibold text-[#0F4C75]"
                >
                  Gender
                </Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={`h-12 rounded-xl border-2 ${
                          errors.gender ? "border-red-500" : "border-[#0F4C75]"
                        } focus-visible:ring-0`}
                      >
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {genders.map((g) => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.gender && (
                  <p className="text-sm text-red-600">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => router.push(`/clients/${clientId}`)}
                className="w-full sm:w-auto max-w-xs rounded-full border-2 border-gray-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting || updateMutation.isPending}
                className="w-full sm:w-auto max-w-xs rounded-full bg-[#0F4C75] font-semibold hover:bg-[#0F4C75]/90"
              >
                {updateMutation.isPending ? "Updating..." : "Update Client"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
