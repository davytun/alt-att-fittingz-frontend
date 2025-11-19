"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const defaultFields = [
  { label: "Bust / Chest(inches)", key: "bust_chest" },
  { label: "Waist (inches)", key: "waist" },
  { label: "Shoulder width (inches)", key: "shoulder_width" },
  { label: "Sleeve Length (inches)", key: "sleeve_length" },
  { label: "Neck(inches)", key: "neck" },
  { label: "Biceps (inches)", key: "biceps" },
  { label: "Thigh (inches)", key: "thigh" },
  { label: "Calf (inches)", key: "calf" },
  { label: "Length (inches)", key: "length" },
  { label: "Inseam (inches)", key: "inseam" },
];

interface MeasurementsFormProps {
  clientId: string;
  onSave: (measurement: {
    name: string;
    measurements: Record<string, string>;
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function MeasurementsForm({
  onSave,
  onCancel,
  isLoading,
}: Omit<MeasurementsFormProps, "clientId">) {
  const [measurementName, setMeasurementName] = useState("");
  const [measurements, setMeasurements] = useState<Record<string, string>>({});
  const [customFields, setCustomFields] = useState<
    Array<{ label: string; key: string; isEditing: boolean }>
  >([]);

  const handleInputChange = (key: string, value: string) => {
    setMeasurements((prev) => ({ ...prev, [key]: value }));
  };

  const addCustomField = () => {
    const newField = {
      label: `Custom Field ${customFields.length + 1}`,
      key: `custom_${Date.now()}`,
      isEditing: true,
    };
    setCustomFields((prev) => [...prev, newField]);
  };

  const _updateCustomFieldLabel = (key: string, newLabel: string) => {
    setCustomFields((prev) =>
      prev.map((field) =>
        field.key === key
          ? { ...field, label: newLabel, isEditing: false }
          : field,
      ),
    );
  };

  const toggleEditField = (key: string) => {
    setCustomFields((prev) =>
      prev.map((field) =>
        field.key === key ? { ...field, isEditing: !field.isEditing } : field,
      ),
    );
  };

  const handleSave = () => {
    if (!measurementName.trim()) return;
    onSave({ name: measurementName, measurements });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <Label
          htmlFor="measurement-name"
          className="text-sm font-medium text-[#222831]"
        >
          Measurement Name
        </Label>
        <Input
          id="measurement-name"
          value={measurementName}
          onChange={(e) => setMeasurementName(e.target.value)}
          className="h-12 rounded-lg border-2 border-gray-200 focus:border-[#0F4C75] mt-2"
          placeholder="e.g., Shirt, Pants, Dress"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {defaultFields.map((field) => (
          <div key={field.key} className="space-y-2">
            <Label
              htmlFor={field.key}
              className="text-sm font-medium text-[#222831]"
            >
              {field.label}
            </Label>
            <Input
              id={field.key}
              value={measurements[field.key] || ""}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              className="h-12 rounded-lg border-2 border-gray-200 focus:border-[#0F4C75]"
              placeholder="0"
            />
          </div>
        ))}

        {customFields.map((field) => (
          <div key={field.key} className="space-y-2">
            {field.isEditing ? (
              <Input
                value={field.label}
                onChange={(e) => {
                  setCustomFields((prev) =>
                    prev.map((f) =>
                      f.key === field.key ? { ...f, label: e.target.value } : f,
                    ),
                  );
                }}
                onBlur={() => toggleEditField(field.key)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    toggleEditField(field.key);
                  }
                }}
                className="text-sm font-medium border-2 border-[#0F4C75] rounded-lg"
                placeholder="Enter field name"
                autoFocus
              />
            ) : (
              <Label
                htmlFor={field.key}
                className="text-sm font-medium text-[#222831] cursor-pointer hover:text-[#0F4C75]"
                onClick={() => toggleEditField(field.key)}
              >
                {field.label}
              </Label>
            )}
            <Input
              id={field.key}
              value={measurements[field.key] || ""}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              className="h-12 rounded-lg border-2 border-gray-200 focus:border-[#0F4C75]"
              placeholder="0"
            />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Button
          variant="outline"
          onClick={addCustomField}
          className="w-full h-12 border-2 border-dashed border-gray-300 text-gray-600 hover:border-[#0F4C75] hover:text-[#0F4C75]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Field
        </Button>
      </div>

      <div className="mt-8 space-y-3">
        <Button
          onClick={handleSave}
          disabled={isLoading || !measurementName.trim()}
          className="w-full h-12 bg-[#0F4C75] hover:bg-[#0F4C75]/90 text-white rounded-lg disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save Measurement"}
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          className="w-full h-12 border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-lg"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
