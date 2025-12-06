"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { useCreateClient } from "@/hooks/api/use-clients";
import {
  type CreateClientFormData,
  createClientSchema,
} from "@/lib/client-schemas";

const genders = ["Male", "Female", "Other"] as const;

export function CreateClientForm() {
  const router = useRouter();
  const createMutation = useCreateClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateClientFormData>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      gender: "Female",
    },
  });

  const onSubmit = async (data: CreateClientFormData) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success("Client created successfully!");
      router.push("/clients");
    } catch (error) {
      toast.error("Failed to create client. Please try again.");
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto w-full max-w-4xl space-y-8 px-4 md:px-0"
    >
      <Card className="rounded-3xl border border-[#E4ECFA] bg-white">
        <CardHeader className="px-6 pt-8 pb-0 text-center md:px-12">
          <CardTitle className="text-xl font-semibold text-[#0F4C75] md:text-2xl">
            Client Information
          </CardTitle>
          <CardDescription className="mt-2 text-sm text-[#6C7A89]">
            Fill in the client details to create a new profile
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
                <p className="text-sm text-red-600">{errors.gender.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting || createMutation.isPending}
              className="w-full max-w-xs rounded-full bg-[#0F4C75] font-semibold hover:bg-[#0F4C75]/90"
            >
              {createMutation.isPending ? "Creating..." : "Create Client"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
