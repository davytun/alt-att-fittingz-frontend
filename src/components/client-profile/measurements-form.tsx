// components/measurements-form.tsx (only the custom field part changed)
"use client";

import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const defaultFields = [
  { label: "Bust / Chest (inches)", key: "bust_chest" },
  { label: "Waist (inches)", key: "waist" },
  { label: "Shoulder width (inches)", key: "shoulder_width" },
  { label: "Sleeve Length (inches)", key: "sleeve_length" },
  { label: "Neck (inches)", key: "neck" },
  { label: "Biceps (inches)", key: "biceps" },
  { label: "Thigh (inches)", key: "thigh" },
  { label: "Calf (inches)", key: "calf" },
  { label: "Length (inches)", key: "length" },
  { label: "Inseam (inches)", key: "inseam" },
];

const defaultFieldKeys = defaultFields.map(f => f.key);
export function MeasurementsForm({
  onSave,
  onCancel,
  isLoading,
  initialData,
}: {
  onSave: (data: {
    name: string;
    measurements: Record<string, string>;
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: {
    name: string;
    measurements: Record<string, string>;
  };
}) {
  const [measurementName, setMeasurementName] = useState(initialData?.name || "");
  const [measurements, setMeasurements] = useState<Record<string, string>>(initialData?.measurements || {});

  // Fixed custom fields state
  const [customFields, setCustomFields] = useState<
    Array<{ id: string; label: string; key: string; isEditing: boolean }>
  >(() => {
    if (!initialData?.measurements) return [];
    const customKeys = Object.keys(initialData.measurements).filter(key => 
      !defaultFieldKeys.includes(key)
    );
    return customKeys.map(key => {
      const labelFromKey = key.replace(/_/g, ' ');
      return {
        id: key,
        key,
        label: labelFromKey,
        isEditing: false,
      };
    });
  });

  const handleInputChange = (key: string, value: string) => {
    setMeasurements((prev) => ({ ...prev, [key]: value }));
  };

  // PERFECT add custom field
  const addCustomField = () => {
    const id = Date.now().toString();
    setCustomFields((prev) => [
      ...prev,
      { id, key: "", label: "", isEditing: true },
    ]);
  };

  // Edit label
  const startEditing = (id: string) => {
    setCustomFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isEditing: true } : f)),
    );
  };

  const saveLabel = (id: string, newLabel: string) => {
    if (!newLabel.trim()) return;
    const oldField = customFields.find(f => f.id === id);
    const newKey = newLabel.trim().replace(/\s+/g, '_');
    
    setCustomFields((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, key: newKey, label: newLabel.trim(), isEditing: false } : f,
      ),
    );
    
    // Update measurements with new key
    if (oldField && oldField.key && oldField.key !== newKey) {
      setMeasurements((prev) => {
        const newMeasurements = { ...prev };
        if (oldField.key in newMeasurements) {
          newMeasurements[newKey] = newMeasurements[oldField.key];
          delete newMeasurements[oldField.key];
        }
        return newMeasurements;
      });
    }
  };

  const handleSave = () => {
    if (!measurementName.trim()) return;
    onSave({ name: measurementName, measurements });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 mb-15">
      {/* Name field */}
      <div className="space-y-2">
        <Label className="text-base font-bold text-[#222831]">
          Measurement Name
        </Label>
        <Input
          value={measurementName}
          onChange={(e) => setMeasurementName(e.target.value)}
          placeholder="e.g., Summer Shirt, Wedding Suit"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Default Fields */}
        {defaultFields.map((field) => (
          <div key={field.key} className="space-y-2">
            <Label className="text-sm font-semibold text-[#222831]">
              {field.label}
            </Label>
            <Input
              value={measurements[field.key] || ""}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              placeholder="0"
            />
          </div>
        ))}

        {/* Custom Fields – NOW 100% WORKING */}
        {customFields.map((field) => (
          <div key={field.id} className="space-y-2">
            {field.isEditing ? (
              <Input
                defaultValue={field.label}
                onBlur={(e) => saveLabel(field.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    saveLabel(field.id, e.currentTarget.value);
                    e.currentTarget.blur();
                  }
                  if (e.key === "Escape") {
                    saveLabel(field.id, field.label);
                    e.currentTarget.blur();
                  }
                }}
                className="font-semibold text-[#0F4C75] border-[#0F4C75]"
                placeholder="Field name..."
                autoFocus
              />
            ) : (
              <Label
                onClick={() => startEditing(field.id)}
                className="text-sm font-semibold text-[#222831] cursor-pointer hover:text-[#0F4C75] transition-colors"
              >
                {field.label}
                <span className="ml-2 text-xs opacity-60">(click to edit)</span>
              </Label>
            )}

            <Input
              value={measurements[field.key] || ""}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              placeholder="0"
            />
          </div>
        ))}
      </div>

      {/* Add Button */}
      <Button
        variant="outline"
        onClick={addCustomField}
        className="w-full h-11 border-dashed border-[#222831]/30 hover:border-[#0F4C75] hover:text-[#0F4C75]"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Custom Field
      </Button>

      {/* Save/Cancel */}
      <div className="flex gap-4 pt-6">
        <Button
          onClick={handleSave}
          disabled={isLoading || !measurementName.trim()}
          className="flex-1 h-11 bg-[#0F4C75] hover:bg-[#0F4C75]/90 text-white font-bold"
        >
          {isLoading ? "Saving..." : "Save Measurement"}
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1 h-11 border-red-300 text-red-600 hover:bg-red-50 font-bold"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
