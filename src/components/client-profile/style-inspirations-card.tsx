import { Edit, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StyleInspirationsCardProps {
  styleImages: string[];
}

export function StyleInspirationsCard({
  styleImages,
}: StyleInspirationsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          Style Inspirations
        </CardTitle>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-3">
          {styleImages.map((image, index) => (
            <div
              key={image || `style-${index}`}
              className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <span className="text-gray-500 text-sm">Style {index + 1}</span>
              </div>
            </div>
          ))}
          <div className="aspect-[3/4] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center space-y-2 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all">
            <Upload className="h-6 w-6 text-gray-400" />
            <span className="text-sm text-gray-500">Attach</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
