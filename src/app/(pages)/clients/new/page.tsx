import type { Metadata } from "next";
import { CreateClientForm } from "@/components/create-client-form";

export const metadata: Metadata = {
  title: "Add Client - Fittingz",
  description: "Add a new client to your fashion business",
};

export default function CreateClientPage() {
  return <CreateClientForm />;
}
