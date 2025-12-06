import type { Metadata } from "next";
import { CreateClientForm } from "@/components/create-client-form";

export const metadata: Metadata = {
  title: "Add Client - Fittingz",
  description: "Add a new client to your fashion business",
};

export default function CreateClientPage() {
  return (
    <div className="space-y-8">
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

      <CreateClientForm />
    </div>
  );
}
