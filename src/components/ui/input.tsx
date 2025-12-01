// components/ui/input.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base layout
          "flex h-12 w-full rounded-lg border bg-background px-4 py-2 text-base",
          "placeholder:text-[#222831]/40",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "disabled:cursor-not-allowed disabled:opacity-50",

          // ALWAYS 1px border
          "border border-[#0F4C75]",

          // On focus: same 1px but bold primary color + subtle shadow
          "focus-visible:outline-none focus-visible:border-[#0F4C75] focus-visible:shadow-[0_0_0_3px_rgba(15,76,117,0.15)]",

          // Error state
          "data-[invalid=true]:border-red-500 data-[invalid=true]:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]",

          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
export { Input };
