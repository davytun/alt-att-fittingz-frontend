"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
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

const genders = ["Male", "Female", "Other"];

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
      favoriteColors: [],
      dislikedColors: [],
      preferredStyles: [],
      bodyShape: "",
      additionalDetails: "",
    },
  });

  const onSubmit = async (data: CreateClientFormData) => {
    try {
      await createMutation.mutateAsync(data);
      router.push("/clients");
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-b-[3rem] bg-[#0F4C75] px-6 py-12 text-white shadow-sm md:px-12">
        <div className="relative z-10 flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.2em] text-white/80">
            Add New Client
          </p>
          <h1 className="text-2xl font-bold md:text-3xl">
            Create a new client profile
          </h1>
        </div>
        <div className="pointer-events-none absolute -right-16 -bottom-20 h-56 w-56 rounded-full bg-white/10 md:-right-6 md:-bottom-16" />
      </section>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-4xl space-y-8 px-4 md:px-0"
      >
        <Card className="rounded-4xl border border-[#E4ECFA] bg-white shadow-lg">
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
                  placeholder="Enter your client full name"
                  {...register("name")}
                  className="h-12 rounded-xl border-2 border-[#0F4C75] bg-white text-[#222831] placeholder:text-[#6C7A89] focus-visible:ring-0"
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
                  placeholder="Enter your client phone number"
                  {...register("phone")}
                  className="h-12 rounded-xl border-2 border-[#0F4C75] bg-white text-[#222831] placeholder:text-[#6C7A89] focus-visible:ring-0"
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
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your client email address"
                  {...register("email")}
                  className="h-12 rounded-xl border-2 border-[#0F4C75] bg-white text-[#222831] placeholder:text-[#6C7A89] focus-visible:ring-0"
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
                        className={`h-12 py-5.5 w-full rounded-xl border-2 bg-white text-[#222831] focus-visible:ring-0 ${
                          errors.gender
                            ? "border-red-500 focus:border-red-500"
                            : "border-[#0F4C75] focus:border-[#0F4C75]"
                        }`}
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

            <div className="flex justify-center pt-2">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting || createMutation.isPending}
                className="w-full max-w-xs rounded-full bg-[#0F4C75] text-base font-semibold text-white hover:bg-[#0F4C75]/90"
              >
                {isSubmitting || createMutation.isPending
                  ? "Creating Client..."
                  : "Create Client"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
