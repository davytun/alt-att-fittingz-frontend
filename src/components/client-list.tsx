import type { Client } from "@/types/client";

interface ClientListProps {
  clients: Client[];
}

export function ClientList({ clients }: ClientListProps) {
  return (
    <div className="space-y-4">
      {clients.map((client) => (
        <div key={client.id} className="border rounded-lg p-4">
          <h3 className="font-semibold">{client.name}</h3>
          <p className="text-gray-600">{client.email}</p>
        </div>
      ))}
    </div>
  );
}
