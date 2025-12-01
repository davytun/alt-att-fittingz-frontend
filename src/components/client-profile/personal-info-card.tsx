import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PersonalInfoCardProps {
  client: {
    name: string;
    email: string;
    phone: string;
    gender: string;
  };
}

export function PersonalInfoCard({ client }: PersonalInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-sm font-medium text-[#222831]">Name</span>
            <h3 className="text-base font-semibold">{client.name}</h3>
          </div>
          <div className="space-y-1">
            <span className="text-sm font-medium text-[#222831]">Email</span>
            <p className="text-[#222831] font-semibold break-all text-sm sm:text-base">
              {client.email}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-sm font-medium text-[#222831]">Phone</span>
            <p className="text-[#222831] font-semibold text-sm sm:text-base">
              {client.phone}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-sm font-medium text-[#222831]">Gender</span>
            <p className="text-[#222831] font-semibold text-sm sm:text-base">
              {client.gender}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
